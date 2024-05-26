import { basename, dirname, join } from 'node:path'
import { promisify } from 'node:util'
import { spawn } from 'node:child_process'
import { createReadStream, readdir as readdirC } from 'node:fs'
import * as vscode from 'vscode'
import { filterTree, processTraceFiles } from '../shared/src/traceTree'
import { getTracePanel, postMessage, prepareWebView } from './webview'
import { getCurrentConfig } from './configuration'
import { log } from './logger'
import type { CommandId } from './constants'
import { addTraceFile, clearTraceFiles, getProjectPath, getTraceDir, getWorkspacePath, openTerminal, setLastMessageTrigger } from './storage'

const readdir = promisify(readdirC)

const commandHandlers: Record<
  CommandId,
  (context: vscode.ExtensionContext) => (...args: any[]) => void
  > = {
    'tsperf.tracer.runTrace': (context: vscode.ExtensionContext) => () => runTrace(context),
    'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => prepareWebView(context),
    'tsperf.tracer.gotoTracePosition': (context: vscode.ExtensionContext) => () => gotoTracePosition(context),
    'tsperf.tracer.sendTrace': (context: vscode.ExtensionContext) => (event: unknown) => {
      if (!(Array.isArray(event) && event[0] instanceof vscode.Uri))
        return

      getTracePanel(context)

      const fsPath = event[0].fsPath

      sendTrace(dirname(fsPath), basename(fsPath))
    },
    'tsperf.tracer.openTerminal': () => () => openTerminal(),
  } as const

async function sendTrace(dirName: string, fileName: string) {
  const fullFileName = join(dirName, fileName)

  const stream = createReadStream(fullFileName, { autoClose: true, emitClose: true, encoding: 'utf-8' })

  let fileContents = ''

  stream.on('end', () => {
    postMessage({ message: 'traceFileLoaded', fileName, dirName })
    addTraceFile(fileName, fileContents)
    processTraceFiles() // todo wait for all files to avoid repeated work
    const nodes = filterTree('check', '', 0)
    postMessage({ message: 'showTree', nodes })
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
  postMessage({ message: 'gotoTracePosition', fileName: editor.document.fileName, position: startOffset - 1 })
  const nodes = filterTree('', editor.document.fileName, startOffset - 1)
  postMessage({ message: 'showTree', nodes })
}

async function runTrace(context: vscode.ExtensionContext) {
  getTracePanel(context)
  const { traceCmd } = getCurrentConfig()
  const traceDir = `${await getTraceDir()}`

  if (!traceDir) {
    vscode.window.showWarningMessage('No workspace or folder open')
    return
  }

  // TODO: use logic from real time metrics that get the tsconfig path
  const workspacePath = getWorkspacePath()

  const quotedTraceDir = `'${traceDir}'`
  // eslint-disable-next-line no-template-curly-in-string
  const fullCmd = `(cd '${workspacePath}'; ${traceCmd.replace('${traceDir}', quotedTraceDir)})`

  log(fullCmd)

  const projectPath = await getProjectPath()
  if (!projectPath) {
    vscode.window.showErrorMessage('could not get project path from workspace folders')
    return
  }

  postMessage({ message: 'traceStart' })

  const cmdProcess = spawn(fullCmd, [], { cwd: projectPath, shell: true })
  cmdProcess.on('error', (error) => {
    vscode.window.showErrorMessage(error.message)
  })

  cmdProcess.on('exit', async (code) => {
    if (code) {
      vscode.window.showErrorMessage('error running trace')
      const terminal = await openTerminal()
      terminal.sendText(fullCmd)
      return
    }
    postMessage({ message: 'traceStop' })

    clearTraceFiles()

    await sendTraceDir(traceDir)
  })
}

export async function sendTraceDir(traceDir: string) {
  try {
    const fileNames = await readdir(traceDir)
    for (const fileName of fileNames)
      sendTrace(traceDir, fileName)
  }
  catch (e) {
    vscode.window.showErrorMessage(e instanceof Error ? e.message : `${e}`)
  }
}
