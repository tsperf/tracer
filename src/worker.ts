import { PerformanceObserver, performance } from 'node:perf_hooks'
import * as assert from 'node:assert'
import fs from 'node:fs'
import process from 'node:process'

import ts from 'typescript'

import type { LanguageServiceSingleMeasurement, MeasureLanguageServiceArgs } from './index'

export const workerPath = __filename

let commandLine: ts.ParsedCommandLine | undefined
let languageServiceHost: ts.LanguageServiceHost | undefined
let languageService: ts.LanguageService | undefined

function createLanguageServiceHost(
  compilerOptions: ts.CompilerOptions,
  testPaths: string[],
): ts.LanguageServiceHost {
  let version = 0
  return {
    directoryExists: ts.sys.directoryExists,
    getCompilationSettings: () => compilerOptions,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getDefaultLibFileName: () => require.resolve('typescript/lib/lib.d.ts'),
    getNewLine: () => ts.sys.newLine,
    getScriptFileNames: () => testPaths,
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    getDirectories: ts.sys.getDirectories,
    getScriptSnapshot: fileName => ts.ScriptSnapshot.fromString(ts.sys.readFile(ensureExists(fileName))!),
    getScriptVersion: () => (version++).toString(),
  }
}

function ensureExists(...pathNames: string[]): string {
  for (const pathName of pathNames) {
    // tslint:disable-next-line:non-literal-fs-path -- filename comes from Azure artifact
    if (fs.existsSync(pathName))
      return pathName
  }
  const pathNamesPrint = pathNames.length > 1 ? `\n${pathNames.map(s => ` - ${s}`).join('\n')}` : `'${pathNames[0]}`
  throw new Error(`File or directory does not exist: ${pathNamesPrint}`)
}

function getCompletionsAtPosition(languageService: ts.LanguageService, fileName: string, pos: number): boolean {
  performance.mark('beforeCompletions')
  const completions = languageService.getCompletionsAtPosition(fileName, pos, undefined)
  performance.mark('afterCompletions')
  performance.measure('completionsMeasurement', 'beforeCompletions', 'afterCompletions')
  return !!completions && completions.entries.length > 0
}

function getQuickInfoAtPosition(languageService: ts.LanguageService, fileName: string, pos: number): boolean {
  performance.mark('beforeQuickInfo')
  const quickInfo = languageService.getQuickInfoAtPosition(fileName, pos)
  performance.mark('afterQuickInfo')
  performance.measure('quickInfoMeasurement', 'beforeQuickInfo', 'afterQuickInfo')
  return !!quickInfo
}

async function measureLanguageService(
  languageService: ts.LanguageService,
  args: MeasureLanguageServiceArgs,
): Promise<LanguageServiceSingleMeasurement> {
  return {
    fileName: args.fileName,
    start: args.start,
    ...(await measureAtPosition(args.fileName, args.start)),
  }

  async function measureAtPosition(fileName: string, position: number): Promise<Pick<LanguageServiceSingleMeasurement, 'quickInfoDuration' | 'completionsDuration'>> {
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
    getCompletionsAtPosition(languageService, fileName, position)
    getQuickInfoAtPosition(languageService, fileName, position)
    // Node 16 changed the PerformanceObserver callback to happen async,
    // so we have to sit here and wait for it...
    await new Promise(resolve => setTimeout(resolve, 0))
    assert.ok(!isNaN(quickInfoDuration), 'No measurement was recorded for quick info')
    assert.ok(!isNaN(completionsDuration), 'No measurement was recorded for completions')
    observer.disconnect()

    return {
      quickInfoDuration,
      completionsDuration,
    }
  }
}

if (process.send) {
  process.on('message', async (message: unknown) => {
    commandLine ||= message.commandLine
    if (!languageServiceHost || !languageService) {
      languageServiceHost = createLanguageServiceHost(commandLine!.options, commandLine!.fileNames)
      languageService = ts.createLanguageService(languageServiceHost)
      // Warm up - make sure functions are compiled
      getCompletionsAtPosition(languageService, message.fileName, message.start)
      getQuickInfoAtPosition(languageService, message.fileName, message.start)
    }

    const positionMeasurement = await measureLanguageService(languageService, message)
    process.send!(positionMeasurement)
  })

  process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
  })
}
