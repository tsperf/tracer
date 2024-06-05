import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { log } from 'node:console'
import { nextTick } from 'node:process'
import { type Ref, type ShallowRef, type UnwrapRef, watch as plainWatch, ref, shallowRef } from '@vue/runtime-core'
import type * as vscode from 'vscode'
import type { TraceData } from '../shared/src/traceData'
import { getTracePanel, isTraceViewAlive, postMessage } from './webview'
import { getProjectName, getWorkspacePath } from './storage'
import { setStatusBarState } from './statusBar'
import { sendTraceDir } from './commands'

export const workspacePath = ref('')
export const projectName = ref('')
export const projectPath = ref('')
export const saveName = ref('')
export const savePath = ref('')

export const saveNames: Ref<string[]> = ref([])
export const projectNames: Ref<string[]> = ref([])

export const traceFiles: ShallowRef<Record<string, TraceData>> = shallowRef({})

export const traceRunning = ref(false)

export const tracePath = ref('')

export const state = {
  workspacePath,
  projectName,
  projectPath,
  saveName,
  savePath,
  saveNames,
  projectNames,
  traceFiles,
  traceRunning,
  tracePath,
} as const
type State = typeof state
type StateType<K extends keyof State> = State[K] extends Ref<any> ? UnwrapRef<State[K]> : State[K]

let context: vscode.ExtensionContext
let storagePath: string
export async function initAppState(extensionContext: vscode.ExtensionContext) {
  context = extensionContext
  storagePath = context.globalStorageUri.fsPath

  watchT('saveNames', noop, (names) => {
    postMessage({ message: 'saveNames', names })
  })
  watchT('projectNames', noop, names => postMessage({ message: 'projectNames', names }))

  watchT('projectName', (name) => {
    if (!name)
      return

    if (!projectNames.value.includes(name))
      projectNames.value.push(name)
    setStatusBarState('projectName', projectName.value)
    getProjectPath()

    if (isTraceViewAlive())
      getTracePanel().title = `Trace View - ${name}`

    function getSaves(atPath: string) {
      const files = readdirSync(atPath)
      for (const file of files) {
        const fullPath = join(atPath, file)
        const stat = statSync(fullPath)
        if (stat.isDirectory()) {
          if (basename(file) === 'traces') {
            const savePath = dirname(fullPath)
            const saveName = relative(projectPath.value, savePath)
            if (!saveNames.value.includes(saveName)) {
              saveNames.value.push(saveName)
            }
          }
          else {
            getSaves(fullPath)
          }
          // TODO: check for project config file, particularly to get the last used save name
        }
      }
    }

    getSaves(projectPath.value)
    saveName.value = 'default'
  }, name => postMessage({ message: 'projectOpen', name }))

  watchT('savePath', (path) => {
    if (!path)
      return

    mkdirSync(path, { recursive: true })
  }, noop)

  watchT('tracePath', (path) => {
    if (!path)
      return

    mkdirSync(path, { recursive: true })
  }, noop)

  watchT('saveName', (name) => {
    if (!name)
      return

    postMessage({ message: 'saveOpen', name })
    if (!saveNames.value.includes(name))
      saveNames.value.push(name)
    setStatusBarState('saveName', saveName.value)
    tracePath.value = join(projectPath.value, name, 'traces')

    void sendTraceDir(tracePath.value)
  }, (name) => {
    postMessage({ message: 'saveOpen', name })
  })

  watchT('traceFiles', noop, (files) => {
    postMessage({ message: 'traceFileLoaded', fileName: '', dirName: tracePath.value, resetFileList: true })
    nextTick(() =>

      Object.keys(files).forEach((fileName) => {
        postMessage({ message: 'traceFileLoaded', fileName, dirName: tracePath.value, resetFileList: false })
      }),
    )
  })

  watchT('traceRunning', (running: boolean) => setStatusBarState('tracing', running), (running: boolean) => {
    postMessage({ message: running ? 'traceStart' : 'traceStop' })
  })

  workspacePath.value = getWorkspacePath()
  projectName.value = getProjectName()
  saveName.value = 'default'
}

const triggers: Partial<Record<keyof State, { handler: ((arg: any) => void | Promise<void>), remoteHandler: (arg: any) => void }>> = {}
export function watchT<K extends keyof State>(triggerName: K, handler: (arg: StateType<K>) => void, remoteHandler: (arg: StateType<K>) => void) {
  triggers[triggerName] = { handler, remoteHandler }
  plainWatch(state[triggerName], (value: any) => {
    try {
      handler(value)
      remoteHandler(value)
    }
    catch (e) {
      log(`${e}`)
    }
  })
}

export function triggerWatchRemote(watchName: keyof State) {
  triggerWatch(watchName, false, true)
}
export function triggerWatchLocal(watchName: keyof State) {
  triggerWatch(watchName, true, false)
}
export function triggerWatch(watchName: keyof State, local = true, remote = true) {
  const trigger = triggers[watchName]
  if (!trigger)
    throw new Error(`watchName not found${watchName}`)

  const value = state[watchName].value
  if (local) {
    const result = trigger.handler(value)
    if (remote) {
      if (result instanceof Promise)
        result.then(() => trigger.remoteHandler(value))
      else
        trigger.remoteHandler(value)
    }
  }
  else if (remote) {
    trigger.remoteHandler(value)
  }
}
export function triggerAll(local: boolean, remote: boolean) {
  for (const watchName in triggers) {
    triggerWatch(watchName as keyof State, local, remote)
  }
}

export async function noop() {}

function getProjectPath() {
  projectPath.value = join(storagePath, projectName.value)
  mkdirSync(projectPath.value, { recursive: true })
  return projectPath.value
}
