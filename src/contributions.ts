import * as vscode from 'vscode'
import { getTracePanel, postMessage, prepareWebView } from './webview'

const commandHandlers = {
  'tsperf.tracer.runTrace':
    () => () => {
      vscode.window.showInformationMessage('trace not implemented')
    },
  'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => {
    prepareWebView(context)
  },
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
