import { join } from 'node:path'
import * as vscode from 'vscode'
import * as Messages from '../shared/src/messages'
import { filterTree, getChildrenById, getTypesById } from './client/actions'
import { log } from './logger'
import { postMessage } from './webview'
import { deleteTraceFiles, setLastMessageTrigger } from './storage'
import { state, triggerAll } from './appState'

export function handleMessage(message: unknown): void {
  if (message === 'init client') {
    triggerAll(false, true)
    filterTree('check', '', 0, true)
    return
  }

  setLastMessageTrigger(message)
  const parsed = Messages.message.safeParse(message)
  if (!parsed.success) {
    vscode.window.showWarningMessage(`Unknown message ${JSON.stringify(message).slice(0, 20)}`)
    return
  }

  const data = parsed.data
  switch (data.message) {
    case 'ping':
      vscode.window.showInformationMessage('Pinged from webview')
      postMessage({ message: 'pong' })
      break
    case 'pong': break
    case 'gotoLocation': break
    case 'gotoPosition':
      gotoPosition(data.fileName, data.pos)
      break
    case 'log':
      log(...data.value)
      break
    case 'filterTree': {
      filterTree(data.startsWith, data.sourceFileName, data.position || 0, true)
      break
    }
    case 'saveOpen': {
      state.saveName.value = data.name
      break
    }
    case 'childrenById': {
      getChildrenById(data.id)
      break
    }
    case 'typesById': {
      getTypesById(data.id)
      break
    }

    case 'deletTraceFile': {
      deleteTraceFiles(data.fileName, data.dirName)
    }
  }
}

async function gotoPosition(fileName: string, pos: number) {
  const workspacePath = state.workspacePath.value
  const uri = vscode.Uri.file(join(workspacePath, fileName))
  const document = vscode.workspace.textDocuments.find(x => x.fileName === fileName) ?? await vscode.workspace.openTextDocument(uri)
  const position = document.positionAt(pos + 1)
  const location = new vscode.Location(uri, position)

  const editor = vscode.window.visibleTextEditors.find(editor => editor.document.fileName === fileName)
  if (editor) {
    vscode.window.showTextDocument(editor.document, editor?.viewColumn, false)
    editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.Default)
  }

  vscode.commands.executeCommand(
    'editor.action.goToLocations',
    uri,
    position,
    [location],
    'goto',
    'location not found',
  )
}
