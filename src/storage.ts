import { mkdir as mkdirC, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { promisify } from 'node:util'
import { env } from 'node:process'
import * as vscode from 'vscode'
import type { TraceData } from '../shared/src/traceData'
import { traceData } from '../shared/src/traceData'
import { postMessage } from './webview'
import { sendTraceDir } from './commands'
import { setStatusBarState } from './statusBar'
import { getCurrentConfig } from './configuration'

// TODO: track creation of directories to avoid excess mkdir calls

const mkdir = promisify(mkdirC)

const saveNames: string[] = []
const projectNames: string[] = []
let saveName = 'default'
let projectName = 'Not Named'
let attemptedGetProjectName = false

export async function getProjectName() {
  if (attemptedGetProjectName)
    return projectName
  attemptedGetProjectName = true

  const workspacePath = getWorkspacePath()
  try {
    const packageStr = readFileSync(join(workspacePath, 'package.json'), { encoding: 'utf8' })
    const json = JSON.parse(packageStr)
    if ('name' in json && typeof json.name === 'string')
      projectName = json.name
    else
      projectName = `unnamed-${simpleHash(workspacePath)}`
  }
  catch (_e) {
    projectName = `unnamed-${simpleHash(workspacePath)}`
  }

  return projectName
}

let traceFiles: Record<string, TraceData> = {}

export async function sendStorageMeta() {
  postMessage({ message: 'projectNames', names: projectNames })
  postMessage({ message: 'saveNames', names: saveNames })
  postMessage({ message: 'projectOpen', name: projectName })
  postMessage({ message: 'saveOpen', name: saveName })
  const traceDir = await getTraceDir()
  Object.keys(traceFiles).forEach((fileName, idx) => {
    postMessage({ message: 'traceFileLoaded', fileName, dirName: traceDir, resetFileList: idx === 0 })
  })
}

export async function openSave(name: string) {
  if (!saveNames.includes(name))
    saveNames.push(name)
  saveName = name
  setStatusBarState('saveName', saveName)

  const traceDir = await getTraceDir()
  mkdir(traceDir, { recursive: true })

  sendStorageMeta()
  void sendTraceDir(traceDir)
}

export async function openProject(name: string) {
  if (!projectNames.includes(name))
    projectNames.push(name)
  projectName = name
  setStatusBarState('projectName', projectName)
  const projectPath = await getProjectPath()
  mkdir(projectPath, { recursive: true })

  function getSaves(atPath: string) {
    const files = readdirSync(atPath)
    for (const file of files) {
      const fullPath = join(atPath, file)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        if (basename(file) === 'traces') {
          const savePath = dirname(fullPath)
          const saveName = relative(projectPath, savePath)
          if (!saveNames.includes(saveName)) {
            saveNames.push(saveName)
          }
        }
        else {
          getSaves(fullPath)
        }
      // TODO: check for project config file, particularly to get the last used save name
      }
    }
  }

  getSaves(projectPath)

  openSave('default')
}

let context: vscode.ExtensionContext
export async function initStorage(extensionContext: vscode.ExtensionContext) {
  context = extensionContext

  const projectName = await getProjectName()
  openProject(projectName)
}

export async function getProjectPath() {
  const storagePath = context.globalStorageUri.fsPath
  const projectPath = join(storagePath, await getProjectName())
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

export function getWorkspacePath(): string {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath
  if (!workspacePath) {
    vscode.window.showErrorMessage('Could not determine project path')
    throw new Error('Could not determine workspace path')
  }
  return workspacePath
}

const terminalName = 'Tracer Storage'
export async function openTerminal(show = true): Promise<vscode.Terminal> {
  let terminal = vscode.window.terminals.find(x => x.name === terminalName)
  if (terminal) {
    if (show)
      terminal.show()
    return terminal
  }
  const projectPath = await getProjectPath()
  await mkdir(projectPath, { recursive: true })
  terminal = vscode.window.createTerminal({ cwd: projectPath, name: terminalName })

  if (show)
    terminal.show()

  return terminal
}

export async function openTraceDirectoryExternal() {
  const traceDir = await getTraceDir()
  const terminal = await openTerminal(false)

  const executable = getCurrentConfig().fileBrowserExecutable
  if (executable) {
    // eslint-disable-next-line no-template-curly-in-string
    terminal.sendText(`${executable.replace('${traceDir}', traceDir)}`)
  }
  else if (vscode.env.remoteName === 'wsl') {
    terminal.sendText(`explorer.exe $(wslpath -w '${traceDir}')\n`)
  }
  // hopefully this is a good check for windows
  else if (!vscode.env.appRoot.startsWith('/')) {
    terminal.sendText(`explorer.exe '${traceDir}'\n`)
  }
  else {
    terminal.show()
    terminal.sendText(`cd '${traceDir}'`)
    // eslint-disable-next-line no-template-curly-in-string
    terminal.sendText('echo \'Please set the extension setting "File Browser Executable" to open trace directories in your preferred application\nFor example: vscode "${traceDir}"\'\n\n')
  }
}

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

// allow setting this in the debugger
// set it to the full path of devUiDriver/commands.ts to record for driver playback
// eslint-disable-next-line prefer-const
let logMessagesFileName = env.TracerLogMessages

let lastMessageTrigger: any
export function setLastMessageTrigger(trigger: any) {
  lastMessageTrigger = trigger
}

let logMessagesStarted = false
export const logMessage = logMessagesFileName
  ? (message: any) => {
      if (!logMessagesStarted) {
        writeFileSync(logMessagesFileName, 'export const commands = [\n', { flag: 'w' })
        logMessagesStarted = true
      }
      const s = `${JSON.stringify({ trigger: lastMessageTrigger, response: message }, null, 2)},\n`
      writeFileSync(logMessagesFileName, s, { flag: 'a' })
    }
  : () => {
    /* do nothing */
    }

// credit: https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
function simpleHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
  }
  // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
  return (hash >>> 0).toString(36).padStart(7, '0')
}

export async function deleteTraceFiles(fileName: string, dirName?: string) {
  const deleteDirName = dirName ?? await getTraceDir()
  if (fileName === '*') {
    const files = readdirSync(deleteDirName)
    for (const file of files) {
      if (!file.endsWith('.json'))
        continue
      const stat = statSync(file)
      if (stat.isFile()) {
        rmSync(join(deleteDirName, file))
      }
    }
  }
  else if (fileName.endsWith('.json')) {
    rmSync(join(deleteDirName, fileName))
  }
}
