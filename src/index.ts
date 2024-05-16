import path from 'node:path'

import { PerformanceObserver } from 'node:perf_hooks'
import type { CompilerOptions, Node, ParsedCommandLine, SourceFile, server } from 'typescript'
import { debounce } from 'perfect-debounce'

import * as vscode from 'vscode'

import { log } from './logger'
import { getParsedCommandLine, getTsconfigFile } from './shared'
import { registerCommands } from './contributions'
import { initDiagnostics } from './traceDiagnostics'
import { setPanelContext } from './webview'

let ts: typeof import('typescript')
let tsPath: string

export const collection = vscode.languages.createDiagnosticCollection('tsperf')

export async function activate(context: vscode.ExtensionContext) {
  log('============extension activated============')

  tsPath = path.join(path.dirname(vscode.extensions.getExtension('vscode.typescript-language-features')!.extensionPath), 'node_modules/typescript')

  // eslint-disable-next-line ts/no-require-imports
  ts = require(tsPath)

  const _run = debounce(runDiagnostics, 500)
  const run = (filenames: string[]) => Promise.all(getTestFileNames(filenames).map(file => _run(collection, file)))

  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(event => run([event.fileName])))
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => run([event.document.fileName])))
  run(vscode.window.visibleTextEditors.map(editor => editor.document.uri.fsPath))

  setPanelContext(context)
  registerCommands(context)
  initDiagnostics(context)
}

export function deactivate() {}

// Large portions of the following code have been taken from
// https://github.com/microsoft/DefinitelyTyped-tools/blob/41ba894ba571e55fa91ef0bb0d44d6eb6d201943/packages/perf

function getTestFileNames(fileNames: readonly string[]) {
  return fileNames.filter((name) => {
    const ext = path.extname(name)
    return (ext === ts.Extension.Ts || ext === ts.Extension.Tsx) && !name.endsWith(ts.Extension.Dts)
  })
}

function getIdentifiers(sourceFile: SourceFile) {
  const identifiers: Node[] = []
  ts.forEachChild(sourceFile, function visit(node): undefined {
    if (ts.isIdentifier(node))
      identifiers.push(node)
    else
      ts.forEachChild(node, visit)
  })
  return identifiers
}

interface LanguageServiceBenchmark {
  fileName: string
  identifierText: string
  line: number
  offset: number
  start: number
  end: number
  quickInfoDurations: number[]
  completionsDurations: number[]
}

interface LanguageServiceSingleMeasurement {
  fileName: string
  start: number
  quickInfoDuration: number
  completionsDuration: number
}

interface MeasureLanguageServiceArgs
  extends Omit<LanguageServiceSingleMeasurement, 'quickInfoDuration' | 'completionsDuration'> {
  packageDirectory: string
}

interface MeasureLanguageServiceChildProcessArgs extends MeasureLanguageServiceArgs {
  commandLine: ParsedCommandLine
  line: number
  offset: number
  tsPath: string
  [key: string]: any
}

function createLanguageServiceTestMatrix(
  fileNames: string[],
  packageDirectory: string,
  compilerOptions: CompilerOptions,
  iterations: number,
  commandLine: ParsedCommandLine,
) {
  const fileMap = new Map<string, Map<number, LanguageServiceBenchmark>>()
  const inputs: MeasureLanguageServiceChildProcessArgs[] = []
  let uniquePositionCount = 0
  for (const fileName of fileNames) {
    const positionMap = new Map<number, LanguageServiceBenchmark>()
    fileMap.set(fileName, positionMap)
    const sourceFile = ts.createSourceFile(
      fileName,
      ts.sys.readFile(fileName)!,
      compilerOptions.target || ts.ScriptTarget.Latest,
    )
    const identifiers = getIdentifiers(sourceFile).reverse()
    uniquePositionCount += identifiers.length
    for (let i = 0; i < iterations; i++) {
      for (const identifier of identifiers) {
        const start = identifier.getStart(sourceFile)
        if (i === 0) {
          const lineAndCharacter = ts.getLineAndCharacterOfPosition(sourceFile, start)
          const benchmark: LanguageServiceBenchmark = {
            fileName,
            start: lineAndCharacter.character,
            end: identifier.getEnd() - (start - lineAndCharacter.character),
            identifierText: identifier.getText(sourceFile),
            line: lineAndCharacter.line,
            offset: lineAndCharacter.character,
            completionsDurations: [],
            quickInfoDurations: [],
          }
          positionMap.set(start, benchmark)
        }
        const benchmark = positionMap.get(start)!
        inputs.push({
          commandLine,
          fileName,
          start,
          line: benchmark.line,
          offset: benchmark.offset,
          tsPath,
          packageDirectory,
        })
      }
    }
  }
  return {
    inputs,
    uniquePositionCount,
    addMeasurement: (measurement: LanguageServiceSingleMeasurement) => {
      const benchmark = fileMap.get(measurement.fileName)!.get(measurement.start)!
      benchmark.completionsDurations.push(measurement.completionsDuration)
      benchmark.quickInfoDurations.push(measurement.quickInfoDuration)
    },
    getAllBenchmarks: (): LanguageServiceBenchmark[] => {
      return Array.from(fileMap.values()).flatMap(map => Array.from(map.values()))
        .filter(benchmark =>
          benchmark.completionsDurations.length > 0
          || benchmark.quickInfoDurations.length > 0,
        )
    },
  }
}

async function runDiagnostics(collection: vscode.DiagnosticCollection, filePath: string) {
  const tsConfigFile = await getTsconfigFile(filePath)
  const rootDir = path.dirname(tsConfigFile.fsPath)

  const openFiles = vscode.window.visibleTextEditors.map(editor => editor.document.uri.fsPath)

  const parsedCommandLine = await getParsedCommandLine(filePath)!
  const testPaths = getTestFileNames(parsedCommandLine.fileNames).filter(path => openFiles.includes(path))

  const matrix = createLanguageServiceTestMatrix(testPaths, rootDir, parsedCommandLine.options, 3, parsedCommandLine)

  log({ openFiles, testPaths })

  for (const input of matrix.inputs) {
    const positionMeasurement = await measureLanguageService(input)
    matrix.addMeasurement(positionMeasurement)
  }

  const benchmarks = matrix.getAllBenchmarks()
  const allMeasures = Array.from(benchmarks.values()).flatMap(b => [...b.completionsDurations, ...b.quickInfoDurations])
  const baseline = allMeasures.reduce((a, b) => a + b, 0) / allMeasures.length

  const map: Record<string, vscode.Diagnostic[]> = {}
  for (const benchmark of benchmarks) {
    map[benchmark.fileName] ||= []
    log(benchmark)

    const durations = [...benchmark.completionsDurations, ...benchmark.quickInfoDurations]
    const duration = durations.reduce((a, b) => a + b, 0) / durations.length
    const proportionalTime = duration / baseline

    if (proportionalTime > 1) {
      const comparisonPercentage = Math.round(proportionalTime * 100) - 100
      const sign = comparisonPercentage > 1 ? '+' : ''
      const logLevel = proportionalTime > 2
        ? vscode.DiagnosticSeverity.Error
        : proportionalTime > 1.2
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information

      const range = new vscode.Range(
        new vscode.Position(benchmark.line, benchmark.start),
        new vscode.Position(benchmark.line, benchmark.end),
      )
      const diagnostic = new vscode.Diagnostic(range, `${Math.round(duration)}ms (${sign}${comparisonPercentage}%)`, logLevel)

      diagnostic.source = 'tsperf'
      diagnostic.code = 102

      map[benchmark.fileName].push(diagnostic)
    }
  }

  for (const file in map) {
    const uri = vscode.Uri.file(file)
    collection.set(uri, map[file])
  }

  log('updated benchmarks')
}

async function getCompletionsAtPosition(fileName: string, line: number, offset: number): Promise<boolean> {
  performance.mark('beforeCompletions')
  const completions = await vscode.commands.executeCommand('typescript.tsserverRequest', 'completionInfo', { file: fileName, line, offset } satisfies server.protocol.CompletionsRequestArgs) as server.protocol.CompletionInfoResponse
  performance.mark('afterCompletions')
  performance.measure('completionsMeasurement', 'beforeCompletions', 'afterCompletions')
  return completions && completions.success
}

async function getQuickInfoAtPosition(fileName: string, line: number, offset: number): Promise<boolean> {
  performance.mark('beforeQuickInfo')
  const quickInfo = await vscode.commands.executeCommand('typescript.tsserverRequest', 'quickinfo-full', {
    file: fileName,
    line,
    offset,
  } satisfies server.protocol.FileLocationRequestArgs) as server.protocol.QuickInfoResponse
  performance.mark('afterQuickInfo')
  performance.measure('quickInfoMeasurement', 'beforeQuickInfo', 'afterQuickInfo')
  return quickInfo && quickInfo.success
}

async function measureLanguageService(args: MeasureLanguageServiceChildProcessArgs): Promise<LanguageServiceSingleMeasurement> {
  let quickInfoDuration = Number.NaN
  let completionsDuration = Number.NaN
  const observer = new PerformanceObserver((list) => {
    const completionsMeasurement = list.getEntriesByName('completionsMeasurement')[0]
    const quickInfoMeasurement = list.getEntriesByName('quickInfoMeasurement')[0]
    if (completionsMeasurement)
      completionsDuration = completionsMeasurement.duration

    if (quickInfoMeasurement)
      quickInfoDuration = quickInfoMeasurement.duration
  })

  observer.observe({ entryTypes: ['measure'] })

  await vscode.commands.executeCommand('typescript.tsserverRequest', 'emit-output', {
    file: args.fileName,
    forced: true,
    richResponse: true,
  } satisfies server.protocol.CompileOnSaveEmitFileRequestArgs) as server.protocol.CompileOnSaveEmitFileResponse

  await Promise.all([
    getCompletionsAtPosition(args.fileName, args.line, args.offset),
    getQuickInfoAtPosition(args.fileName, args.line, args.offset),
  ])

  await new Promise(resolve => setTimeout(resolve, 0))
  observer.disconnect()

  return {
    fileName: args.fileName,
    start: args.start,
    quickInfoDuration,
    completionsDuration,
  }
}
