import * as vscode from 'vscode'
import { prepareWebView } from './webview'

const commandHandlers = {
  'tsperf.tracer.runTrace':
    () => () => {
      vscode.window.showInformationMessage('trace not implemented')
    },
  'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => {
    prepareWebView(context)
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
