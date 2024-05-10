import assert from 'node:assert'
import path from 'node:path'
import type { ChildProcess, Serializable } from 'node:child_process'
import { fork } from 'node:child_process'

import { Socket } from 'node:net'
import { debounce } from 'perfect-debounce'
import ts from 'typescript'
import * as vscode from 'vscode'

import { log } from './logger'
import { getParsedCommandLine, getTsconfigFile } from './shared'
import { workerPath } from './worker'

export async function activate(context: vscode.ExtensionContext) {
  log('============extension activated============')

  // const typescriptConfiguration = vscode.workspace.getConfiguration('typescript')
  // const typescriptPath = typescriptConfiguration.get('tsdk')
  // const pkgJson = vscode.extensions.getExtension('vscode.typescript-language-features')?.packageJSON
  // outputChannel.appendLine(`TypeScript Version: ${JSON.stringify(pkgJson || {})}`)

  const collection = vscode.languages.createDiagnosticCollection('tsperf')
  const run = debounce(runDiagnostics, 500)
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((event) => {
    if (path.isAbsolute(event.fileName) && /\.tsx?$/.test(event.fileName)) {
      run(collection, event.fileName)
    }
  }))
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
    if (path.isAbsolute(event.document.fileName) && /\.tsx?$/.test(event.document.fileName)) {
      run(collection, event.document.fileName)
    }
  }))
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

function getIdentifiers(sourceFile: ts.SourceFile) {
  const identifiers: ts.Node[] = []
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
  commandLine: ts.ParsedCommandLine
  [key: string]: any
}

function createLanguageServiceTestMatrix(
  testPaths: string[],
  packageDirectory: string,
  compilerOptions: ts.CompilerOptions,
  iterations: number,
  commandLine: ts.ParsedCommandLine,
) {
  const fileMap = new Map<string, Map<number, LanguageServiceBenchmark>>()
  const inputs: MeasureLanguageServiceChildProcessArgs[] = []
  let uniquePositionCount = 0
  for (const testPath of testPaths) {
    const positionMap = new Map<number, LanguageServiceBenchmark>()
    fileMap.set(testPath, positionMap)
    const sourceFile = ts.createSourceFile(
      testPath,
      ts.sys.readFile(testPath)!,
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
          const previousLine = ts.getLineAndCharacterOfPosition(sourceFile, start - lineAndCharacter.character)
          const benchmark: LanguageServiceBenchmark = {
            fileName: testPath,
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
          fileName: testPath,
          start,
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
      return Array.prototype.concat
        .apply(
          [],
          Array.from(fileMap.values()).map(map => Array.from(map.values())),
        )
        .filter(
          (benchmark: LanguageServiceBenchmark) =>
            benchmark.completionsDurations.length > 0 || benchmark.quickInfoDurations.length > 0,
        )
    },
  }
}

const DEFAULT_CRASH_RECOVERY_MAX_OLD_SPACE_SIZE = 4096
const DEFAULT_CHILD_RESTART_TASK_INTERVAL = 1_000_000
interface RunWithListeningChildProcessesOptions<In> {
  readonly inputs: readonly In[]
  readonly workerFile: string
  readonly nProcesses: number
  readonly cwd: string
  readonly crashRecovery?: boolean
  readonly crashRecoveryMaxOldSpaceSize?: number
  readonly childRestartTaskInterval?: number
  readonly softTimeoutMs?: number
  handleOutput: (output: LanguageServiceSingleMeasurement, processIndex: number | undefined) => void
  handleStart?: (input: In, processIndex: number | undefined) => void
  handleCrash?: (input: In, state: CrashRecoveryState, processIndex: number | undefined) => void
}

function runWithListeningChildProcesses<In extends Serializable>({
  inputs,
  workerFile,
  nProcesses,
  cwd,
  handleOutput,
  crashRecovery,
  crashRecoveryMaxOldSpaceSize = DEFAULT_CRASH_RECOVERY_MAX_OLD_SPACE_SIZE,
  childRestartTaskInterval = DEFAULT_CHILD_RESTART_TASK_INTERVAL,
  handleStart,
  handleCrash,
  softTimeoutMs = Number.POSITIVE_INFINITY,
}: RunWithListeningChildProcessesOptions<In>): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let inputIndex = 0
    let processesLeft = nProcesses
    let tasksSoFar = 0
    let rejected = false
    const runningChildren = new Set<ChildProcess>()
    const maxOldSpaceSize = getMaxOldSpaceSize(process.execArgv) || 0
    const startTime = Date.now()
    for (let i = 0; i < nProcesses; i++) {
      if (inputIndex === inputs.length) {
        processesLeft--
        continue
      }

      const processIndex = nProcesses > 1 ? i + 1 : undefined
      let child: ChildProcess
      let crashRecoveryState = CrashRecoveryState.Normal
      let currentInput: In

      const onMessage = (outputMessage: unknown) => {
        try {
          tasksSoFar++
          const oldCrashRecoveryState = crashRecoveryState
          crashRecoveryState = CrashRecoveryState.Normal
          handleOutput(outputMessage as LanguageServiceSingleMeasurement, processIndex)
          if (inputIndex === inputs.length || Date.now() - startTime > softTimeoutMs) {
            stopChild(/* done */ true)
          }
          else {
            if (oldCrashRecoveryState !== CrashRecoveryState.Normal) {
              // retry attempt succeeded, restart the child for further tests.
              console.log(`${processIndex}> Restarting...`)
              restartChild(nextTask, process.execArgv)
            }
            else if (tasksSoFar >= childRestartTaskInterval) {
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
          // treat any unhandled closures of the child as a crash
          if (crashRecovery) {
            switch (crashRecoveryState) {
              case CrashRecoveryState.Normal:
                crashRecoveryState = CrashRecoveryState.Retry
                break
              case CrashRecoveryState.Retry:
                // skip crash recovery if we're already passing a value for --max_old_space_size that
                // is >= crashRecoveryMaxOldSpaceSize
                crashRecoveryState
                  = maxOldSpaceSize < crashRecoveryMaxOldSpaceSize
                    ? CrashRecoveryState.RetryWithMoreMemory
                    : (crashRecoveryState = CrashRecoveryState.Crashed)
                break
              default:
                crashRecoveryState = CrashRecoveryState.Crashed
            }
          }
          else {
            crashRecoveryState = CrashRecoveryState.Crashed
          }

          if (handleCrash)
            handleCrash(currentInput, crashRecoveryState, processIndex)

          switch (crashRecoveryState) {
            case CrashRecoveryState.Retry:
              await restartChild(resumeTask, process.execArgv)
              break
            case CrashRecoveryState.RetryWithMoreMemory:
              await restartChild(resumeTask, [
                ...getExecArgvWithoutMaxOldSpaceSize(),
                `--max_old_space_size=${crashRecoveryMaxOldSpaceSize}`,
              ])
              break
            case CrashRecoveryState.Crashed:
              crashRecoveryState = CrashRecoveryState.Normal
              if (inputIndex === inputs.length || Date.now() - startTime > softTimeoutMs)
                stopChild(/* done */ true)
              else
                await restartChild(nextTask, process.execArgv)

              break
            default:
              assert.fail(`${processIndex}> Unexpected crashRecoveryState: ${crashRecoveryState}`)
          }
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

function getMaxOldSpaceSize(argv: readonly string[]): number | undefined {
  const arg = getMaxOldSpaceSizeArg(argv)
  return arg && arg.value
}

const maxOldSpaceSizeRegExp = /^--max[-_]old[-_]space[-_]size(?:$|=(\d+))/

interface MaxOldSpaceSizeArgument {
  index: number
  size: number
  value: number | undefined
}

let execArgvWithoutMaxOldSpaceSize: readonly string[] | undefined

function getExecArgvWithoutMaxOldSpaceSize(): readonly string[] {
  if (!execArgvWithoutMaxOldSpaceSize) {
    // remove --max_old_space_size from execArgv
    const execArgv = process.execArgv.slice()
    let maxOldSpaceSizeArg = getMaxOldSpaceSizeArg(execArgv)
    while (maxOldSpaceSizeArg) {
      execArgv.splice(maxOldSpaceSizeArg.index, maxOldSpaceSizeArg.size)
      maxOldSpaceSizeArg = getMaxOldSpaceSizeArg(execArgv)
    }
    execArgvWithoutMaxOldSpaceSize = execArgv
  }
  return execArgvWithoutMaxOldSpaceSize
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

function getMaxOldSpaceSizeArg(argv: readonly string[]): MaxOldSpaceSizeArgument | undefined {
  for (let index = 0; index < argv.length; index++) {
    const match = maxOldSpaceSizeRegExp.exec(argv[index])
    if (match) {
      const value = match[1] ? Number.parseInt(match[1], 10) : argv[index + 1] ? Number.parseInt(argv[index + 1], 10) : undefined
      const size = match[1] ? 1 : 2 // tslint:disable-line:no-magic-numbers
      return { index, size, value }
    }
  }
  return undefined
}

const enum CrashRecoveryState {
  Normal,
  Retry,
  RetryWithMoreMemory,
  Crashed,
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
    crashRecovery: false,
    cwd: rootDir,
    softTimeoutMs: 10 * 1000,
    handleCrash: (input) => {
      log('Failed measurement on request:', JSON.stringify(input, undefined, 2))
    },
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

    const duration = benchmark.quickInfoDurations.reduce((a, b) => a + b, 0) / benchmark.quickInfoDurations.length

    const proportionalTime = duration / baseline
    log(benchmark)

    const comparisonPercentage = Math.round(proportionalTime * 100) - 100

    if (proportionalTime > 1.5) {
      const sign = comparisonPercentage > 1 ? '+' : ''
      const logLevel = proportionalTime > 2 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning

      const range = new vscode.Range(
        new vscode.Position(benchmark.line, benchmark.start),
        new vscode.Position(benchmark.line, benchmark.end),
      )
      const diagnostic = new vscode.Diagnostic(range, `${sign}${comparisonPercentage}%`, logLevel)

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
