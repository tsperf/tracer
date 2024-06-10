import { log } from 'node:console'
import * as vscode from 'vscode'
import { state, traceRunning } from '../appState'
import { setStatusBarState } from '../statusBar'
import type { Tree } from '../../shared/src/tree'
import { postMessage } from '../webview'
import { addTraceDiagnostics } from '../traceDiagnostics'
import { wsMessage } from './client'

export function runTrace(projectPath: string, traceDir: string) {
  wsMessage('traceStart', { projectPath, traceDir }) (
    'traceStop',
    () => traceRunning.value = false,
    (error: string) => {
      traceRunning.value = false
      setStatusBarState('traceError', true)
      vscode.window.showErrorMessage(error)
    },
  )
}

export function filterTree(startsWith: string, sourceFileName: string, position: number, updateUi: boolean) {
  const treeRoots: Tree[] = []
  wsMessage('filterTree', { startsWith, sourceFileName, position }) (
    'showTree',
    (message, complete) => {
      treeRoots.push(...message.nodes)
      if (updateUi) {
        postMessage(message)
      }

      if (complete)
        state.treeRoots.value = treeRoots
    },
    (error: string) => {
      log(`error filtering tree: ${error}`)
    },
  )
}

export function getFileStats(fileName: string) {
  wsMessage('fileStats', { fileName, stats: [] }) (
    'fileStats',
    message => addTraceDiagnostics(message.fileName, message.stats),
    (error: string) => {
      vscode.window.showErrorMessage(error)
    },
  )
}

export function getChildrenById(id: number) {
  wsMessage('childrenById', { id }) (
    'childrenById',
    (message) => {
      postMessage(message)
    },
    (error: string) => {
      vscode.window.showErrorMessage(error)
    },
  )
}

export function getTypesById(id: number) {
  wsMessage('typesById', { id }) (
    'typesById',
    postMessage,
    (error: string) => {
      vscode.window.showErrorMessage(error)
    },
  )
}
