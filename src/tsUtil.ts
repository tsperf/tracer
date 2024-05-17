import path from 'node:path'
import * as vscode from 'vscode'

let ts: typeof import('typescript')
let tsPath: string

export function getTs() {
  if (!ts)
    throw new Error('ts not initialized')

  return ts
}

export function getTsPath() {
  if (!tsPath)
    throw new Error('tsPath no initialized')

  return tsPath
}

export function setTsPath(mode: string, explicitPath: string) {
  switch (mode) {
    case 'explicit':
      tsPath = explicitPath
      break
    case 'vscode-builtin':
      tsPath = path.join(path.dirname(vscode.extensions.getExtension('vscode.typescript-language-features')!.extensionPath), 'node_modules/typescript')
      break
    case 'tsdk':
      tsPath = (vscode.workspace.getConfiguration('typescript').get<string>('tsdk') ?? '').replace(/\/lib$/, '')
      break
    case 'workspace':
      tsPath = getWorkspaceTsPath()
      break
  }
  // eslint-disable-next-line no-console
  console.log(tsPath)
  return tsPath
}

function getWorkspaceTsPath() {
  const folder = vscode.workspace.workspaceFolders?.[0]
  if (!folder)
    return ''

  return path.join(folder.uri.fsPath, 'node_modules', 'typescript')
}
