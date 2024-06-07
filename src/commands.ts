import { basename, dirname, join, relative } from 'node:path'
import * as process from 'node:process'
import { promisify } from 'node:util'
import { spawn } from 'node:child_process'
import { createReadStream, existsSync, readdir as readdirC, statSync } from 'node:fs'
import * as vscode from 'vscode'
import { getStatsFromTree, processTraceFiles, showTree, treeIdNodes } from './traceTree'
import { getTracePanel, prepareWebView } from './webview'
import { getCurrentConfig } from './configuration'
import { log } from './logger'
import type { CommandId } from './constants'
import { addTraceFile, getWorkspacePath, openTerminal, openTraceDirectoryExternal, setLastMessageTrigger } from './storage'
import { addTraceDiagnostics, clearTaceDiagnostics } from './traceDiagnostics'
import { setStatusBarState } from './statusBar'
import { afterWatches, projectPath, saveName, state, traceFiles, traceRunning } from './appState'

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
    addTraceFile(fileName, fileContents)
    processTraceFiles().then(() => {
      showTree('check', '', 0)

      clearTaceDiagnostics()
      for (const editor of vscode.window.visibleTextEditors) {
        const visibleFileName = editor.document.fileName
        addTraceDiagnostics(visibleFileName, getStatsFromTree(visibleFileName))
      }
    })
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

  const workspacePth = getWorkspacePath()
  const relativePath = relative(workspacePth, editor.document.fileName)

  getTracePanel(context)?.reveal()
  showTree('', relativePath, startOffset - (editor.document.getText()[startOffset + 1] === '\n' ? 0 : 1))
}

async function runTrace(args?: unknown[]) {
  const workspacePath = state.workspacePath.value
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
    log(`dirName: ${dirName}`)
    saveName.value = relative(workspacePath, dirName)
  }

  const newDirName = dirName
  // TODO: use logic from real time metrics that get the tsconfig path
  afterWatches(() => {
    const traceDir = state.tracePath.value
    if (!traceDir) {
      vscode.window.showWarningMessage('No workspace or folder open')
      return
    }

    const quotedTraceDir = `'${traceDir}'`
    // eslint-disable-next-line no-template-curly-in-string
    const fullCmd = `(cd '${newDirName ?? workspacePath}'; ${traceCmd.replace('${traceDir}', quotedTraceDir)})`

    log(fullCmd)

    const newProjectPath = newDirName ?? projectPath.value
    if (!newProjectPath) {
      vscode.window.showErrorMessage('could not get project path from workspace folders')
      return
    }

    traceRunning.value = true

    traceFiles.value = {}
    treeIdNodes.clear()

    setStatusBarState('traceError', false)

    log(`shell: ${process.env.SHELL}`)
    const cmdProcess = spawn(fullCmd, [], { cwd: newProjectPath, shell: process.env.SHELL })

    let err = ''
    cmdProcess.stderr.on('data', data => err += data.toString())

    cmdProcess.stdout.on('data', data => log(data.toString()))

    cmdProcess.on('error', (error) => {
      vscode.window.showErrorMessage(error.message)
    })

    cmdProcess.on('exit', async (code) => {
      log('---- trace stderr -----')
      log(err)
      traceRunning.value = false
      if (code) {
        setStatusBarState('traceError', true)
        vscode.window.showErrorMessage('error running trace')
        return
      }

      await sendTraceDir(traceDir)
    })
  })
}

export async function sendTraceDir(traceDir: string) {
  try {
    if (!existsSync(traceDir)) {
      return
    }

    const fileNames = await readdir(traceDir)
    for (const fileName of fileNames) {
      sendTrace(traceDir, fileName)
    }
  }
  catch (e) {
    vscode.window.showErrorMessage(e instanceof Error ? e.message : `${e}`)
  }
}
