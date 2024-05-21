import { basename, dirname, join } from 'node:path'
import { promisify } from 'node:util'
import { spawn } from 'node:child_process'
import { createReadStream, mkdir as mkdirC, readdir as readdirC, stat as statC } from 'node:fs'
import * as vscode from 'vscode'
import { getTracePanel, postMessage, prepareWebView } from './webview'
import { getCurrentConfig } from './configuration'
import { log } from './logger'

const mkdir = promisify(mkdirC)
const stat = promisify(statC)
const readdir = promisify(readdirC)

const commandHandlers = {
  'tsperf.tracer.runTrace': (context: vscode.ExtensionContext) => () => runTrace(context),
  'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => prepareWebView(context),
  'tsperf.tracer.gotoTracePosition': (context: vscode.ExtensionContext) => () => gotoTracePosition(context),
  'tsperf.tracer.sendTrace': (context: vscode.ExtensionContext) => (event: unknown) => {
    if (!(event instanceof vscode.Uri))
      return

    getTracePanel(context)

    const fsPath = event.fsPath

    sendTrace(dirname(fsPath), basename(fsPath))
  },
} as const

async function sendTrace(dirName: string, fileName: string) {
  const fullFileName = join(dirName, fileName)
  const fileStat = await stat(fullFileName)
  const size = fileStat.size

  const stream = createReadStream(fullFileName, { autoClose: true, emitClose: true, encoding: 'utf-8' })

  postMessage({ message: 'traceFileStart', fileName, size })

  stream.on('end', () => postMessage({ message: 'traceFileEnd', fileName }))

  function readChunks() {
    const chunk = stream.read()
    if (chunk === null)
      return

    postMessage({ message: 'traceFileChunk', fileName, chunk })
    setImmediate(readChunks)
  }
  stream.on('readable', readChunks)
}

export function registerCommands(context: vscode.ExtensionContext) {
  for (const cmd in commandHandlers) {
    const disposable = vscode.commands.registerCommand(
      cmd,
      commandHandlers[cmd as keyof typeof commandHandlers](context),
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
  postMessage({ message: 'gotoTracePosition', fileName: editor.document.fileName, position: startOffset - 1 })
  getTracePanel(context)?.reveal()
}

let traceDir = ''
async function runTrace(context: vscode.ExtensionContext) {
  getTracePanel(context)
  traceDir = ''
  const { traceCmd } = getCurrentConfig()
  const storagePath = context.storageUri?.fsPath

  if (!storagePath) {
    vscode.window.showWarningMessage('No workspace or folder open')
    return
  }
  traceDir = join(storagePath, 'traces')
  await mkdir(traceDir, { recursive: true })

  // eslint-disable-next-line no-template-curly-in-string
  const fullCmd = traceCmd.replace('${traceDir}', traceDir)

  log(fullCmd)

  const projectPath = getProjectPath()
  if (!projectPath) {
    vscode.window.showErrorMessage('could not get project path from workspace folders')
    return
  }

  postMessage({ message: 'traceStart' })

  const cmdProcess = spawn(fullCmd, [], { cwd: projectPath, shell: true })
  cmdProcess.on('error', (error) => {
    vscode.window.showErrorMessage(error.message)
  })

  cmdProcess.on('exit', async () => {
    postMessage({ message: 'traceStop' })

    try {
      const fileNames = await readdir(traceDir)
      for (const fileName of fileNames)
        sendTrace(traceDir, fileName)
    }
    catch (e) {
      vscode.window.showErrorMessage(e instanceof Error ? e.message : `${e}`)
      return
    }

    postMessage({ message: 'ping' }) // TODO - trigger processing trace files here
  })
}

function getProjectPath(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath
}
