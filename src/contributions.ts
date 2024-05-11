import * as vscode from 'vscode'
import { serverPort } from './traceDiagnostics'

const indexUri = vscode.Uri.parse(
   `http://localhost:${serverPort}/app/index.html`,
)

const commandHandlers = {
  'tsperf.tracer.runTrace':
    () => {
      vscode.window.showInformationMessage('trace not implemented')
    },
  'tsperf.tracer.openInBrowser':
    () => {
      vscode.env.openExternal(indexUri)
    },
} as const

export function registerCommands(context: vscode.ExtensionContext) {
  for (const cmd in commandHandlers) {
    const disposable = vscode.commands.registerCommand(
      cmd,
      commandHandlers[cmd as never],
    )

    context.subscriptions.push(disposable)
  }
}
