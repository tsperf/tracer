import { join } from 'node:path'
import { env } from 'node:process'

import { log } from 'node:console'
import * as vscode from 'vscode'

// error is not generated when running traces on just UI
// eslint-disable-next-line ts/prefer-ts-expect-error
// @ts-ignore raw loader
// eslint-disable-next-line antfu/no-import-dist
import html from '../ui/dist/200.html?raw'
import type { Message } from '../shared/src/messages'
import { showTree } from './traceTree'
import { handleMessage } from './handleMessages'
import { getProjectName, logMessage, sendStorageMeta } from './storage'

let devEmitter = (_message: any) => {}

let holdContext: vscode.ExtensionContext | undefined
export function setPanelContext(extensionContext: vscode.ExtensionContext) {
  holdContext = extensionContext

  // You have to export TRACER_DEV from your shell source file
  // annoying, but I haven't found any other way to get the launcher to pass an env variable through
  const isDev = env.env && (env.env as any).TRACER_DEV
  // eslint-disable-next-line node/prefer-global/process
  const isDev2 = process.env.TRACER_DEV
  if (isDev || isDev2) {
    import('../srcDev/dist/server/server').then((server) => {
      devEmitter = server.emitMessage
      server.setMessageHandler(message => handleMessage(getTracePanel(), message))
    })
  }
}
let panel: undefined | ReturnType<typeof vscode.window.createWebviewPanel>

let disposed = true

export function isTraceViewAlive() {
  return panel && !disposed
}

export function getTracePanel(context: vscode.ExtensionContext = holdContext!) {
  if (!panel)
    prepareWebView(context, false)

  return panel!
}

export function prepareWebView(context: vscode.ExtensionContext | undefined = holdContext, show = false) {
  if (!context)
    throw new Error('context was not passed or set')

  let ret: vscode.Disposable | undefined
  if (!panel) {
    panel = vscode.window.createWebviewPanel(
      'vueWebView',
      'Trace Viewer',
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      { enableScripts: true, retainContextWhenHidden: true },
    )
    context.subscriptions.push(panel)

    disposed = false
    panel.onDidDispose(() => {
      panel = undefined
      disposed = true
    })

    const processedHTML = (html as string).replace(
      /(src|href)="([^"]+)"/g,
      (string, _attribute, source) => string.replace(source, panel!.webview.asWebviewUri(
        vscode.Uri.file(
          join(context.extensionPath, 'ui/dist', source),
        ),
      ).toString())
      ,
    )

    panel.webview.html = processedHTML
    panel.webview.onDidReceiveMessage((message) => {
      handleMessage(getTracePanel(context), message)
    })

    getProjectName().then((projectName) => {
      if (panel)
        panel.title = `Trace Viewer - ${projectName}`
    })

    ret = panel
  }

  if (show)
    panel.reveal()

  sendStorageMeta().then(() => showTree('check', '', 0))

  return ret
}

export function postMessage(message: Message) {
  logMessage(message)
  devEmitter(message)
  if (isTraceViewAlive())
    getTracePanel().webview.postMessage(message)
}
