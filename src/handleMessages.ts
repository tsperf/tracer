import * as vscode from 'vscode'
import * as Messages from '../messages/src/messages'
import { addTraceDiagnostics } from './traceDiagnostics'
import { log } from './logger'
import { collection as diagnosticCollection } from '.'

let positionTypeCounts: Messages.PositionTypeCounts['counts'] = {}
export function getPositionTypeCounts() {
  return positionTypeCounts
}

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
    case 'gotoPosition':
      gotoPosition(data.fileName, data.pos)
      break
    case 'postionTypeCounts':
      updateDiagnosticCollection(data.counts)
      positionTypeCounts = data.counts
      break
    case 'fileStats':
      addTraceDiagnostics(data)
      break
    case 'log':
      log(...data.value)
      break
  }
}

async function gotoPosition(fileName: string, pos: number) {
  const uri = vscode.Uri.file(fileName)
  const document = vscode.workspace.textDocuments.find(x => x.fileName === fileName) ?? await vscode.workspace.openTextDocument(uri)
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

function updateDiagnosticCollection(counts: Record<string, Record<number, number>>) {
  const map = new Map<vscode.Uri, vscode.Diagnostic[]>()
  diagnosticCollection.forEach(
    (uri, arr) => {
      const fileCounts = counts[uri.fsPath]
      if (!fileCounts) {
        map.set(uri, [...arr])
        return
      }

      const tgt: vscode.Diagnostic[] = []
      map.set(uri, tgt)
      arr.forEach((diagnostic) => {
        const document = vscode.workspace.textDocuments.find(x => x.uri.fsPath === uri.fsPath)
        if (!document) {
          tgt.push(diagnostic)
          return
        }

        const offset = document.offsetAt(diagnostic.range.start)
        const count = fileCounts[offset]
        if (count)
          diagnostic.message += ` Types: ${count}`
        tgt.push(diagnostic)
      })
    },
  )

  map.forEach((v, k) => diagnosticCollection.set(k, v))
}
