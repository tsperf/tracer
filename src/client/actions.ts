import { log } from 'node:console'
import { isAbsolute, relative } from 'node:path'
import * as vscode from 'vscode'
import { state, traceRunning, workspacePath } from '../appState'
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
        message.nodes.forEach((node) => {
          if (node.line.args?.path && isAbsolute(node.line.args.path)) {
            node.line.args.path = relative(workspacePath.value, node.line.args.path)
          }
        })
      }
      postMessage(message)

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
      message.children?.forEach((child) => {
        if (child.line.args?.path && isAbsolute(child.line.args.path)) {
          child.line.args.path = relative(workspacePath.value, child.line.args.path)
        }
      })
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
