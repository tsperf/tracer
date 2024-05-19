import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, readdirSync } from 'node:fs'
import * as vscode from 'vscode'
import { getTracePanel, postMessage, prepareWebView } from './webview'
import { getCurrentConfig } from './configuration'

const commandHandlers = {
  'tsperf.tracer.runTrace': (context: vscode.ExtensionContext) => () => runTrace(context),
  'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => prepareWebView(context),
  'tsperf.tracer.gotoTracePosition': () => gotoTracePosition,
  'tsperf.tracer.sendTrace': (context: vscode.ExtensionContext) => () => {
    let panel = getTracePanel()
    if (!panel) {
      prepareWebView(context, false)
      panel = getTracePanel()
    }

    const document = vscode.window.activeTextEditor?.document

    if (!document)
      return
    const fileName = document.fileName
    const traceString = document.getText()
    postMessage({ message: 'traceFile', fileName, traceString })
  },
} as const

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

function gotoTracePosition() {
  const editor = vscode.window.activeTextEditor
  if (!editor)
    return

  const start = editor.selection.start
  const startOffset = editor.document.offsetAt(start)
  postMessage({ message: 'gotoTracePosition', fileName: editor.document.fileName, position: startOffset - 1 })
  getTracePanel()?.reveal()
}

let traceDir = ''
function runTrace(context: vscode.ExtensionContext) {
  traceDir = ''
  const { traceCmd } = getCurrentConfig()
  const storagePath = context.storageUri?.fsPath

  if (!storagePath) {
    vscode.window.showWarningMessage('No workspace or folder open')
    return
  }
  traceDir = join(storagePath, 'traces')
  mkdirSync(traceDir, { recursive: true })

  // eslint-disable-next-line no-template-curly-in-string
  const fullCmd = traceCmd.replace('${traceDir}', traceDir)

  const projectPath = getProjectPath()
  if (!projectPath) {
    vscode.window.showErrorMessage('could not get procject path from workspace folders')
    return
  }

  const cmdResult = spawnSync(fullCmd, [], { cwd: projectPath, shell: true })
  if (cmdResult.error) {
    vscode.window.showErrorMessage(cmdResult.error.message)
    return
  }

  try {
    const fileNames = readdirSync(traceDir)
    for (const fileName of fileNames) {
      const traceString = readFileSync(join(traceDir, fileName)).toString()
      postMessage({ message: 'traceFile', fileName, traceString })
    }
  }
  catch (e) {
    vscode.window.showErrorMessage(e instanceof Error ? e.message : `${e}`)
    return
  }

  postMessage({ message: 'ping' }) // TODO - trigger processing trace files here
}

function getProjectPath(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath
}
