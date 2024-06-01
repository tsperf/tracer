import { basename, dirname, join, relative } from 'node:path'
import * as process from 'node:process'
import { promisify } from 'node:util'
import { spawn } from 'node:child_process'
import { createReadStream, existsSync, readdir as readdirC, statSync } from 'node:fs'
import * as vscode from 'vscode'
import { getStatsFromTree, processTraceFiles, showTree } from '../shared/src/traceTree'
import { getTracePanel, postMessage, prepareWebView } from './webview'
import { getCurrentConfig } from './configuration'
import { log } from './logger'
import type { CommandId } from './constants'
import { addTraceFile, clearTraceFiles, getProjectPath, getTraceDir, getWorkspacePath, openSave, openTerminal, openTraceDirectoryExternal, setLastMessageTrigger } from './storage'
import { addTraceDiagnostics } from './traceDiagnostics'
import { setStatusBarState } from './statusBar'

const readdir = promisify(readdirC)

const commandHandlers: Record<
  CommandId,
  (context: vscode.ExtensionContext) => (...args: any[]) => void
  > = {
    'tsperf.tracer.runTrace': () => (...args: unknown[]) => runTrace(args),
    'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => prepareWebView(context),
    'tsperf.tracer.gotoTracePosition': (context: vscode.ExtensionContext) => () => gotoTracePosition(context),
    'tsperf.tracer.sendTrace': () => (event: unknown) => {
      if (!(Array.isArray(event) && event[0] instanceof vscode.Uri))
        return

      const fsPath = event[0].fsPath

      sendTrace(dirname(fsPath), basename(fsPath))
    },
    'tsperf.tracer.openTerminal': () => () => openTerminal(),
    'tsperf.tracer.openTraceDirExternal': () => () => openTraceDirectoryExternal(),
  } as const

async function sendTrace(dirName: string, fileName: string) {
  const fullFileName = join(dirName, fileName)

  const stream = createReadStream(fullFileName, { autoClose: true, emitClose: true, encoding: 'utf-8' })

  let fileContents = ''

  stream.on('end', () => {
    postMessage({ message: 'traceFileLoaded', fileName, dirName, resetFileList: false })

    addTraceFile(fileName, fileContents)
    processTraceFiles() // todo wait for all files to avoid repeated work
    showTree('check', '', 0)

    for (const editor of vscode.window.visibleTextEditors) {
      const visibleFileName = editor.document.fileName
      addTraceDiagnostics(visibleFileName, getStatsFromTree(visibleFileName))
    }
  })

  function readChunks() {
    const chunk = stream.read()
    if (chunk === null)
      return

    fileContents += chunk
    setImmediate(readChunks)
  }
  stream.on('readable', readChunks)
}

export function registerCommands(context: vscode.ExtensionContext) {
  for (const cmd in commandHandlers) {
    const disposable = vscode.commands.registerCommand(
      cmd,
      (...args: any[]) => {
        setLastMessageTrigger({ command: cmd, args })
        commandHandlers[cmd as keyof typeof commandHandlers](context)(args)
      },
    )

    if (disposable)
      context.subscriptions.push(disposable)
  }
}

function gotoTracePosition(context: vscode.ExtensionContext) {
  getTracePanel(context)
  const editor = vscode.window.activeTextEditor
  if (!editor)
    return

  const start = editor.selection.start
  const startOffset = editor.document.offsetAt(start)

  getTracePanel(context)?.reveal()
  showTree('', editor.document.fileName, startOffset - (editor.document.getText()[startOffset + 1] === '\n' ? 0 : 1))
}

async function runTrace(args?: unknown[]) {
  const workspacePath = getWorkspacePath()
  const { traceCmd } = getCurrentConfig()

  let dirName
  if (args && args[0] && Array.isArray(args[0]) && args[0][0] instanceof vscode.Uri) {
    const fsPath = args[0][0].fsPath
    if (existsSync(fsPath)) {
      if (statSync(fsPath).isDirectory()) {
        dirName = fsPath
      }
      else {
        dirName = dirname(fsPath)
      }
    }
  }

  if (dirName) {
    const relativeDirName = relative(workspacePath, dirName)
    openSave(relativeDirName)
  }

  // TODO: use logic from real time metrics that get the tsconfig path

  const traceDir = `${await getTraceDir()}`
  if (!traceDir) {
    vscode.window.showWarningMessage('No workspace or folder open')
    return
  }

  const quotedTraceDir = `'${traceDir}'`
  // eslint-disable-next-line no-template-curly-in-string
  const fullCmd = `(cd '${dirName ?? workspacePath}'; ${traceCmd.replace('${traceDir}', quotedTraceDir)})`

  log(fullCmd)

  const projectPath = dirName ?? await getProjectPath()
  if (!projectPath) {
    vscode.window.showErrorMessage('could not get project path from workspace folders')
    return
  }

  postMessage({ message: 'traceStart' })

  setStatusBarState('tracing', true)
  log(`shell: ${process.env.SHELL}`)
  const cmdProcess = spawn(fullCmd, [], { cwd: projectPath, shell: process.env.SHELL })

  let err = ''
  cmdProcess.stderr.on('data', data => err += data.toString())

  cmdProcess.stdout.on('data', data => log(data.toString()))

  cmdProcess.on('error', (error) => {
    vscode.window.showErrorMessage(error.message)
  })

  cmdProcess.on('exit', async (code) => {
    log('---- trace stderr -----')
    log(err)
    setStatusBarState('tracing', false)
    if (code) {
      setStatusBarState('traceError', true)
      vscode.window.showErrorMessage('error running trace')
      return
    }

    setStatusBarState('traceError', false)
    postMessage({ message: 'traceStop' })

    clearTraceFiles()

    await sendTraceDir(traceDir)
  })
}

export async function sendTraceDir(traceDir: string) {
  try {
    const fileNames = await readdir(traceDir)
    postMessage({ message: 'traceFileLoaded', fileName: '', dirName: '', resetFileList: true })
    for (const fileName of fileNames)
      sendTrace(traceDir, fileName)
  }
  catch (e) {
    vscode.window.showErrorMessage(e instanceof Error ? e.message : `${e}`)
  }
}
