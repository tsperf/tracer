import { join } from 'node:path'
import * as vscode from 'vscode'

// @ts-expect-error raw loader
// eslint-disable-next-line antfu/no-import-dist
import html from '../ui/dist/200.html?raw'
import type { Message } from '../messages/src/messages'
import { handleMessage } from './handleMessages'

let holdContext: vscode.ExtensionContext | undefined
export function setPanelContext(extensionContext: vscode.ExtensionContext) {
  holdContext = extensionContext
}
let panel: ReturnType<typeof vscode.window.createWebviewPanel>

export function getTracePanel(context: vscode.ExtensionContext) {
  if (!panel)
    prepareWebView(context, false)

  return panel
}

export function prepareWebView(context: vscode.ExtensionContext | undefined = holdContext, show = true) {
  if (!context)
    throw new Error('context was not passed or set')

  let ret: vscode.Disposable | undefined
  if (!panel) {
    panel = vscode.window.createWebviewPanel(
      'vueWebView',
      'Trace Viewer',
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: !show },
      { enableScripts: true, retainContextWhenHidden: true },
    )

    const processedHTML = (html as string).replace(
      /(src|href)="([^"]+)"/g,
      (string, _attribute, source) => string.replace(source, panel.webview.asWebviewUri(
        vscode.Uri.file(
          join(context.extensionPath, 'ui/dist', source),
        ),
      ).toString())
      ,
    )

    panel.webview.html = processedHTML
    panel.webview.onDidReceiveMessage((message) => {
      handleMessage(panel, message)
    })

    ret = panel
  }

  if (show)
    panel.reveal()

  return ret
}

export function postMessage(message: Message) {
  if (!panel)
    prepareWebView()

  panel.webview.postMessage(message)
}
