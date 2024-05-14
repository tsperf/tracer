import * as vscode from 'vscode'
import { getTracePanel, prepareWebView } from './webview'

const commandHandlers = {
  'tsperf.tracer.runTrace':
    () => () => {
      vscode.window.showInformationMessage('trace not implemented')
    },
  'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => {
    prepareWebView(context)
  },
  'tsperf.tracer.sendTrace': () => () => {
    const panel = getTracePanel()
    if (!panel) {
      vscode.window.showWarningMessage('Trace webview not opened')
      return
    }

    const document = vscode.window.activeTextEditor?.document

    if (!document)
      return
    const fileName = document.fileName
    const traceString = document.getText()
    panel.webview.postMessage({ message: 'traceFile', fileName, traceString })
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
