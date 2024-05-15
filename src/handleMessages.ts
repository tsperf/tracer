import * as vscode from 'vscode'
import * as Messages from '../messages/src/messages'

export function handleMessage(panel: vscode.WebviewPanel, message: unknown): void {
  const parsed = Messages.message.safeParse(message)
  if (!parsed.success) {
    vscode.window.showWarningMessage(`Unknown message ${JSON.stringify(message).slice(0, 20)}`)
    return
  }

  const data = parsed.data
  switch (data.message) {
    case 'ping':
      vscode.window.showInformationMessage('Pinged from webview')
      panel.webview.postMessage({ message: 'pong' })
      break
    case 'pong': break
    case 'gotoLocation': break
    case 'gotoPosition': {
      gotoPosition(data.fileName, data.pos)
    }
  }
}
async function gotoPosition(fileName: string, pos: number) {
  const uri = vscode.Uri.file(fileName)
  const document = await vscode.workspace.openTextDocument(uri)
  const position = document.positionAt(pos + 1)
  const location = new vscode.Location(uri, position)
  vscode.commands.executeCommand(
    'editor.action.goToLocations',
    uri,
    position,
    [location],
    'goto',
    'location not found',
  )
}
