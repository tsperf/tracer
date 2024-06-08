import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { env } from 'node:process'
import * as vscode from 'vscode'
import { getCurrentConfig } from './configuration'
import { log } from './logger'
import { state } from './appState'

export function getProjectName(): string {
  if (state.projectName.value)
    return state.projectName.value

  try {
    const packageStr = readFileSync(join(state.workspacePath.value, 'package.json'), { encoding: 'utf8' })
    const json = JSON.parse(packageStr)
    if ('name' in json && typeof json.name === 'string')
      state.projectName.value = json.name
    else
      state.projectName.value = `unnamed-${simpleHash(state.workspacePath.value)}`
  }
  catch (_e) {
    state.projectName.value = `unnamed-${simpleHash(state.workspacePath.value)}`
  }

  return state.projectName.value
}

export function getSavePath(): string {
  return state.savePath.value = join(state.projectPath.value, state.saveName.value)
}

export function getTraceDir(): string {
  return state.tracePath.value = join(state.savePath.value, 'traces')
}

export function getWorkspacePath(): string {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath
  if (!workspacePath) {
    vscode.window.showErrorMessage('Could not determine project path')
    throw new Error('Could not determine workspace path')
  }
  log(`workspacePath${workspacePath}`)
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
  terminal = vscode.window.createTerminal({ cwd: state.projectPath.value, name: terminalName })

  if (show)
    terminal.show()

  return terminal
}

export async function openTraceDirectoryExternal() {
  const traceDir = state.tracePath.value
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

    if (!Array.isArray(json)) {
      vscode.window.showErrorMessage(`trace ${fileName} is not a json array`)
      return
    }

    state.traceFiles.value[fileName] = json
  }
  catch (e) {
    vscode.window.showErrorMessage(`${e}`)
  }
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
  : (message: any) => {
      log(`message sent: ${message.message}`)
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

const typeTimestampsFileName = 'timestamps.json'
export async function writeTypeTimestamps(data: Map<number, number>) {
  const traceDir = state.tracePath.value
  const fileName = join(traceDir, typeTimestampsFileName)
  writeFileSync(fileName, JSON.stringify([...data.entries()], null, 2))
}

export async function readTypeTimestamps() {
  const traceDir = await getTraceDir()
  const fileName = join(traceDir, typeTimestampsFileName)

  if (!existsSync(fileName))
    return undefined

  const str = readFileSync(fileName).toString()
  const json = JSON.parse(str)

  return new Map<number, number>(json)
}
