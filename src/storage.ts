import { mkdir as mkdirC } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'
import * as vscode from 'vscode'
import type { TraceData } from '../shared/src/traceData'
import { traceData } from '../shared/src/traceData'

// TODO: track creation of directories to avoid excess mkdir calls

const mkdir = promisify(mkdirC)

const saveName = 'default'

let context: vscode.ExtensionContext
export function initStorage(extensionContext: vscode.ExtensionContext) {
  context = extensionContext
}

export async function getProjectPath() {
  const storagePath = context.globalStorageUri.fsPath
  const projectPath = join(storagePath, getProjectName())
  await mkdir(projectPath, { recursive: true })
  return projectPath
}

export async function getSavePath() {
  const savePath = join(await getProjectPath(), saveName)
  await mkdir(savePath, { recursive: true })
  return savePath
}

export async function getTraceDir() {
  const traceDir = join(await getSavePath(), 'traces')
  await mkdir(traceDir, { recursive: true })
  return traceDir
}

export function getProjectName() {
  return 'TODO'
}

export function getWorkspacePath(): string {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath
  if (!workspacePath) {
    vscode.window.showErrorMessage('Could not determine project path')
    throw new Error('Could not determine workspace path')
  }
  return workspacePath
}

const terminalName = 'Tracer Storage'
export async function openTerminal(): Promise<vscode.Terminal> {
  let terminal = vscode.window.terminals.find(x => x.name === terminalName)
  if (terminal) {
    terminal.show()
    return terminal
  }
  const projectPath = await getProjectPath()
  await mkdir(projectPath, { recursive: true })
  terminal = vscode.window.createTerminal({ cwd: projectPath, name: terminalName })
  terminal.show()

  return terminal
}

let traceFiles: Record<string, TraceData> = {}
export function addTraceFile(fileName: string, contents: string) {
  try {
    const json = JSON.parse(contents)

    const arr = traceData.safeParse(json)
    if (!arr.success)
      return

    traceFiles[fileName] = arr.data
  }
  catch (e) {
    vscode.window.showErrorMessage(`${e}`)
  }
}

export function clearTraceFiles() {
  traceFiles = {}
}

export function getTraceFiles() {
  return traceFiles
}
