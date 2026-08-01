import * as vscode from 'vscode'
import { getWorkspacePath } from './storage'
import { state } from './appState'

let selectedTsconfig: string | undefined

export function initMultiRoot(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('tsperf.tracer.selectTsconfig', selectTsconfig),
  )
}

export async function selectTsconfig(): Promise<void> {
  const files = await vscode.workspace.findFiles('**/tsconfig.json', '**/node_modules/**')
  const filteredFiles = files.filter(p => !p.fsPath.includes('node_modules'))

  if (filteredFiles.length === 0) {
    vscode.window.showWarningMessage('No tsconfig.json found in workspace')
    return
  }

  if (filteredFiles.length === 1) {
    selectedTsconfig = filteredFiles[0].fsPath
    vscode.window.showInformationMessage(`Using ${relativePath(filteredFiles[0].fsPath)}`)
    return
  }

  const items = filteredFiles.map((file) => {
    const relative = vscode.workspace.asRelativePath(file)
    return {
      label: relative,
      description: file.fsPath,
      picked: selectedTsconfig === file.fsPath,
    }
  })

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select tsconfig.json for tracing',
    title: 'TSPerf: Select Project Configuration',
  })

  if (selected) {
    selectedTsconfig = selected.description
    vscode.window.showInformationMessage(`Switched to ${selected.label}`)

    // Update workspace path to the tsconfig's parent directory
    const projectDir = vscode.Uri.joinPath(vscode.Uri.file(selectedTsconfig!), '..').fsPath
    if (state.workspacePath.value !== projectDir) {
      state.saveName.value = 'default'
    }
  }
}

export function getSelectedTsconfig(): string | undefined {
  return selectedTsconfig
}

export function getActiveWorkspacePath(): string {
  if (selectedTsconfig) {
    const projectDir = vscode.Uri.joinPath(vscode.Uri.file(selectedTsconfig), '..').fsPath
    return projectDir
  }
  return getWorkspacePath()
}

function relativePath(absolutePath: string): string {
  const workspacePath = getWorkspacePath()
  if (absolutePath.startsWith(workspacePath))
    return absolutePath.slice(workspacePath.length + 1)
  return absolutePath
}
