import { log } from 'node:console'
import * as vscode from 'vscode'
import { state, traceRunning } from '../appState'
import { setStatusBarState } from '../statusBar'
import type { Tree } from '../traceTree'
import { postMessage } from '../webview'
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
      if (updateUi)
        postMessage(message)

      if (complete)
        state.treeRoots.value = treeRoots
    },
    (error: string) => {
      log(`error filtering tree: ${error}`)
    },
  )
}
