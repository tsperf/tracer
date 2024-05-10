import assert from 'node:assert'
import path from 'node:path'
import type { ChildProcess, Serializable } from 'node:child_process'
import { fork } from 'node:child_process'
import { Socket } from 'node:net'

import type { CompilerOptions, Node, ParsedCommandLine, SourceFile } from 'typescript'
import { debounce } from 'perfect-debounce'

import * as vscode from 'vscode'

import { log } from './logger'
import { getParsedCommandLine, getTsconfigFile } from './shared'
import { workerPath } from './worker'

let ts: typeof import('typescript')
let tsPath: string

export async function activate(context: vscode.ExtensionContext) {
  log('============extension activated============')

  tsPath = path.join(path.dirname(vscode.extensions.getExtension('vscode.typescript-language-features')!.extensionPath), 'node_modules/typescript')
  ts = require(tsPath)

  const collection = vscode.languages.createDiagnosticCollection('tsperf')
  
  const _run = debounce(runDiagnostics, 500)
  const run = (filenames: string[]) => Promise.all(getTestFileNames(filenames).map(file => _run(collection, file)))

  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((event) => run([event.fileName])))
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => run([event.document.fileName])))
  run(vscode.window.visibleTextEditors.map(editor => editor.document.uri.fsPath))
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
  ts.forEachChild(sourceFile, function visit(node) {
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

export interface LanguageServiceSingleMeasurement {
  fileName: string
  start: number
  quickInfoDuration: number
  completionsDuration: number
}

export interface MeasureLanguageServiceArgs
  extends Omit<LanguageServiceSingleMeasurement, 'quickInfoDuration' | 'completionsDuration'> {
  packageDirectory: string
}

export interface MeasureLanguageServiceChildProcessArgs extends MeasureLanguageServiceArgs {
  commandLine: ParsedCommandLine
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
    // Reverse: more complex examples are usually near the end of test files,
    // so prioritize those.
    const identifiers = getIdentifiers(sourceFile).reverse()
    uniquePositionCount += identifiers.length
    // Do the loops in this order so that a single child process doesn’t
    // run iterations of the same exact measurement back-to-back to avoid
    // v8 optimizing a significant chunk of the work away.
    for (let i = 0; i < iterations; i++) {
      for (const identifier of identifiers) {
        const start = identifier.getStart(sourceFile)
        if (i === 0) {
          const lineAndCharacter = ts.getLineAndCharacterOfPosition(sourceFile, start)
          const benchmark: LanguageServiceBenchmark = {
            fileName: fileName,
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
        inputs.push({
          commandLine,
          fileName: fileName,
          start,
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
        .filter((benchmark) => benchmark.completionsDurations.length > 0 || benchmark.quickInfoDurations.length > 0)
    },
  }
}

const DEFAULT_CHILD_RESTART_TASK_INTERVAL = 1_000_000
interface RunWithListeningChildProcessesOptions<In> {
  readonly inputs: readonly In[]
  readonly workerFile: string
  readonly nProcesses: number
  readonly cwd: string
  readonly childRestartTaskInterval?: number
  readonly softTimeoutMs?: number
  handleOutput: (output: LanguageServiceSingleMeasurement, processIndex: number | undefined) => void
  handleStart?: (input: In, processIndex: number | undefined) => void
}

function runWithListeningChildProcesses<In extends Serializable>({
  inputs,
  workerFile,
  nProcesses,
  cwd,
  handleOutput,
  handleStart,
  childRestartTaskInterval = DEFAULT_CHILD_RESTART_TASK_INTERVAL,
  softTimeoutMs = Number.POSITIVE_INFINITY,
}: RunWithListeningChildProcessesOptions<In>): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let inputIndex = 0
    let processesLeft = nProcesses
    let tasksSoFar = 0
    let rejected = false
    const runningChildren = new Set<ChildProcess>()
    const startTime = Date.now()
    for (let i = 0; i < nProcesses; i++) {
      if (inputIndex === inputs.length) {
        processesLeft--
        continue
      }

      const processIndex = nProcesses > 1 ? i + 1 : undefined
      let child: ChildProcess
      let currentInput: In

      const onMessage = (outputMessage: unknown) => {
        try {
          tasksSoFar++
          handleOutput(outputMessage as LanguageServiceSingleMeasurement, processIndex)
          if (inputIndex === inputs.length || Date.now() - startTime > softTimeoutMs) {
            stopChild(/* done */ true)
          }
          else {
            if (tasksSoFar >= childRestartTaskInterval) {
              // restart the child to avoid memory leaks.
              stopChild(/* done */ false)
              startChild(nextTask, process.execArgv)
              tasksSoFar = 0
            }
            else {
              nextTask()
            }
          }
        }
        catch (e) {
          onError(e as Error)
        }
      }

      const onClose = async () => {
        if (rejected || !runningChildren.has(child))
          return

        try {
          if (inputIndex === inputs.length || Date.now() - startTime > softTimeoutMs)
            stopChild(/* done */ true)
          else
            await restartChild(nextTask, process.execArgv)
        }
        catch (e) {
          onError(e as Error)
        }
      }

      const onError = (err?: Error) => {
        child.removeAllListeners()
        runningChildren.delete(child)
        fail(err)
      }

      const startChild = async (taskAction: () => void, execArgv: string[]) => {
        try {
          child = fork(workerFile, [], { cwd, execArgv: await getChildProcessExecArgv(i, execArgv) })
          runningChildren.add(child)
        }
        catch (e) {
          fail(e as Error)
          return
        }

        try {
          let closed = false
          const thisChild = child
          const onChildClosed = () => {
            // Don't invoke `onClose` more than once for a single child.
            if (!closed && child === thisChild) {
              closed = true
              onClose()
            }
          }
          const onChildDisconnectedOrExited = () => {
            if (!closed && thisChild === child) {
              // Invoke `onClose` after enough time has elapsed to allow `close` to be triggered.
              // This is to ensure our `onClose` logic gets called in some conditions
              const timeout = 1000
              setTimeout(onChildClosed, timeout)
            }
          }
          child.on('message', onMessage)
          child.on('close', onChildClosed)
          child.on('disconnect', onChildDisconnectedOrExited)
          child.on('exit', onChildDisconnectedOrExited)
          child.on('error', onError)
          taskAction()
        }
        catch (e) {
          onError(e as Error)
        }
      }

      const stopChild = (done: boolean) => {
        try {
          assert(runningChildren.has(child), `${processIndex}> Child not running`)
          if (done) {
            processesLeft--
            if (processesLeft === 0)
              resolve()
          }
          runningChildren.delete(child)
          child.removeAllListeners()
          child.kill()
        }
        catch (e) {
          onError(e as Error)
        }
      }

      const restartChild = async (taskAction: () => void, execArgv: string[]) => {
        try {
          assert(runningChildren.has(child), `${processIndex}> Child not running`)
          console.log(`${processIndex}> Restarting...`)
          stopChild(/* done */ false)
          await startChild(taskAction, execArgv)
        }
        catch (e) {
          onError(e as Error)
        }
      }

      const resumeTask = () => {
        try {
          assert(runningChildren.has(child), `${processIndex}> Child not running`)
          child.send(currentInput)
        }
        catch (e) {
          onError(e as Error)
        }
      }

      const nextTask = () => {
        try {
          assert(runningChildren.has(child), `${processIndex}> Child not running`)
          currentInput = inputs[inputIndex]
          inputIndex++
          if (handleStart)
            handleStart(currentInput, processIndex)

          child.send(currentInput)
        }
        catch (e) {
          onError(e as Error)
        }
      }

      await startChild(nextTask, process.execArgv)
    }

    function fail(err?: Error): void {
      if (!rejected) {
        rejected = true
        for (const child of runningChildren) {
          try {
            child.removeAllListeners()
            child.kill()
          }
          catch {
            // do nothing
          }
        }
        const message = err ? `: ${err.message}` : ''
        reject(new Error(`Something went wrong in ${runWithListeningChildProcesses.name}${message}`))
      }
    }
  })
}

async function getChildProcessExecArgv(portOffset = 0, execArgv = process.execArgv) {
  const debugArg = execArgv.findIndex(
    arg => arg === '--inspect' || arg === '--inspect-brk' || arg.startsWith('--inspect='),
  )
  if (debugArg < 0)
    return execArgv

  const port = Number.parseInt(execArgv[debugArg].split('=')[1], 10) || 9229
  return [
    ...execArgv.slice(0, debugArg),
    `--inspect=${await findFreePort(port + 1 + portOffset, 100, 1000)}`,
    ...execArgv.slice(debugArg + 1),
  ]
}

// From VS Code: https://github.com/microsoft/vscode/blob/7d57a8f6f546b5e30027e7cfa87bd834eb5c7bbb/src/vs/base/node/ports.ts

function findFreePort(startPort: number, giveUpAfter: number, timeout: number): Promise<number> {
  let done = false

  return new Promise((resolve) => {
    const timeoutHandle = setTimeout(() => {
      if (!done) {
        done = true
        return resolve(0)
      }
    }, timeout)

    doFindFreePort(startPort, giveUpAfter, (port) => {
      if (!done) {
        done = true
        clearTimeout(timeoutHandle)
        return resolve(port)
      }
    })
  })
}

function doFindFreePort(startPort: number, giveUpAfter: number, clb: (port: number) => void): void {
  if (giveUpAfter === 0)
    return clb(0)

  const client = new Socket()

  // If we can connect to the port it means the port is already taken so we continue searching
  client.once('connect', () => {
    dispose(client)

    return doFindFreePort(startPort + 1, giveUpAfter - 1, clb)
  })

  client.once('data', () => {
    // this listener is required since node.js 8.x
  })

  client.once('error', (err: Error & { code?: string }) => {
    dispose(client)

    // If we receive any non ECONNREFUSED error, it means the port is used but we cannot connect
    if (err.code !== 'ECONNREFUSED')
      return doFindFreePort(startPort + 1, giveUpAfter - 1, clb)

    // Otherwise it means the port is free to use!
    return clb(startPort)
  })

  client.connect(startPort, '127.0.0.1')

  function dispose(socket: Socket): void {
    try {
      socket.removeAllListeners('connect')
      socket.removeAllListeners('error')
      socket.end()
      socket.destroy()
      socket.unref()
    }
    catch (error) {
      console.error(error) // otherwise this error would get lost in the callback chain
    }
  }
}

async function runDiagnostics(collection: vscode.DiagnosticCollection, filePath: string) {
  const tsConfigFile = await getTsconfigFile(filePath)
  const rootDir = path.dirname(tsConfigFile.fsPath)

  const openFiles = vscode.window.visibleTextEditors.map(editor => editor.document.uri.fsPath)

  const parsedCommandLine = await getParsedCommandLine(filePath)!
  const testPaths = getTestFileNames(parsedCommandLine.fileNames).filter(path => openFiles.includes(path))

  const matrix = createLanguageServiceTestMatrix(testPaths, rootDir, parsedCommandLine.options, 1, parsedCommandLine)

  log({ openFiles, testPaths })

  await runWithListeningChildProcesses({
    inputs: matrix.inputs,
    workerFile: workerPath,
    nProcesses: 10,
    cwd: rootDir,
    softTimeoutMs: 10 * 1000,
    handleOutput: (measurement: LanguageServiceSingleMeasurement) => {
      matrix.addMeasurement(measurement)
    },
  })

  const benchmarks = matrix.getAllBenchmarks()
  const allMeasures = Array.from(benchmarks.values()).flatMap(b => b.quickInfoDurations)
  const baseline = allMeasures.reduce((a, b) => a + b, 0) / allMeasures.length

  const map: Record<string, vscode.Diagnostic[]> = {}
  for (const benchmark of benchmarks) {
    map[benchmark.fileName] ||= []
    log(benchmark)

    const duration = benchmark.quickInfoDurations.reduce((a, b) => a + b, 0) / benchmark.quickInfoDurations.length
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
