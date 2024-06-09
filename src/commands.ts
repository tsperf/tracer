import { dirname, relative } from 'node:path'
import { existsSync, statSync } from 'node:fs'
import * as vscode from 'vscode'
import { getTracePanel, prepareWebView } from './webview'
import { log } from './logger'
import type { CommandId } from './constants'
import { getWorkspacePath, openTerminal, openTraceDirectoryExternal, setLastMessageTrigger } from './storage'
import { afterWatches, saveName, state, traceRunning } from './appState'
import * as actions from './client/actions'
import { filterTree } from './client/actions'

const commandHandlers: Record<
  CommandId,
  (context: vscode.ExtensionContext) => (...args: any[]) => void
  > = {
    'tsperf.tracer.runTrace': () => (...args: unknown[]) => runTrace(args),
    'tsperf.tracer.openInBrowser': (context: vscode.ExtensionContext) => () => prepareWebView(context),
    'tsperf.tracer.gotoTracePosition': (context: vscode.ExtensionContext) => () => gotoTracePosition(context),
    'tsperf.tracer.openTerminal': () => () => openTerminal(),
    'tsperf.tracer.openTraceDirExternal': () => () => openTraceDirectoryExternal(),
  } as const

export function registerCommands(context: vscode.ExtensionContext) {
  for (const cmd in commandHandlers) {
    const disposable = vscode.commands.registerCommand(
      cmd,
      (...args: any[]) => {
        setLastMessageTrigger({ command: cmd, args })
        commandHandlers[cmd as keyof typeof commandHandlers](context)(args)
      },
    )

    if (disposable)
      context.subscriptions.push(disposable)
  }
}

function gotoTracePosition(context: vscode.ExtensionContext) {
  getTracePanel(context)
  const editor = vscode.window.activeTextEditor
  if (!editor)
    return

  const start = editor.selection.start
  const startOffset = editor.document.offsetAt(start)

  const workspacePth = getWorkspacePath()
  const relativePath = relative(workspacePth, editor.document.fileName)

  getTracePanel(context)?.reveal()
  filterTree('', relativePath, startOffset - (editor.document.getText()[startOffset + 1] === '\n' ? 0 : 1), true)
}

const liveTrace = true // TODO config setting
async function runTrace(args?: unknown[]) {
  const workspacePath = state.workspacePath.value

  let dirName
  if (args && args[0] && Array.isArray(args[0]) && args[0][0] instanceof vscode.Uri) {
    const fsPath = args[0][0].fsPath
    if (existsSync(fsPath)) {
      if (statSync(fsPath).isDirectory()) {
        dirName = fsPath
      }
      else {
        dirName = dirname(fsPath)
      }
    }
  }

  if (dirName) {
    log(`dirName: ${dirName}`)
    saveName.value = relative(workspacePath, dirName)
  }

  const packagePath = dirName ?? workspacePath
  // TODO: use logic from real time metrics that get the tsconfig path
  afterWatches(async () => {
    const traceDir = state.tracePath.value
    if (!traceDir) {
      vscode.window.showWarningMessage('No workspace or folder open')
      return
    }

    traceRunning.value = true

    // TODO: move after trace logic to response from startTrace
    if (liveTrace) {
      actions.runTrace(packagePath, traceDir)
      actions.filterTree('checkExpr', '', 0, true)
    }
  })
}
