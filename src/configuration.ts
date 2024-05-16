import * as vscode from 'vscode'
import { setTsPath } from './tsUtil'

const configKeys = [
  'typescript-path',
  'typescript-path-mode',
] as const

type ConfigKey = typeof configKeys[number]
const configKey = 'tsperf.tracer'

const currentConfig = {
  'typescript-path': '',
  'typescript-path-mode': 'vscode-builtin',
} satisfies Record<ConfigKey, any>

function isString(x: unknown): x is string {
  return typeof x === 'string'
}
const configValidate = {
  'typescript-path': isString,
  'typescript-path-mode': isString,
} satisfies Record<ConfigKey, any>

const configHandlers = {
  'typescript-path': (_value: string) => { currentConfig['typescript-path-mode'] = '!ForceUpdate' },
  'typescript-path-mode': (value: string) => { setTsPath(value, currentConfig['typescript-path']) },
} satisfies Record<ConfigKey, any>

let configuration = vscode.workspace.getConfiguration(configKey)

const afterConfigHandlers: [keys: ConfigKey[], handler: (config: typeof currentConfig) => void][] = []

export function updateConfig() {
  const changedKeys: ConfigKey[] = []
  for (const key of configKeys) {
    const newValue = configuration.get(key)
    if (newValue && newValue !== currentConfig[key]) {
      changedKeys.push(key)
      if (!configValidate[key](newValue)) {
        vscode.window.showErrorMessage(`wrong type received for configuration item ${key}: ${newValue}`)
        break
      }
      currentConfig[key] = newValue
      configHandlers[key](newValue)
    }
  }
  for (const after of afterConfigHandlers) {
    const [keys, handler] = after
    if (keys.some(key => changedKeys.includes(key)))
      handler(currentConfig)
  }
}

vscode.workspace.onDidChangeConfiguration((change) => {
  if (change.affectsConfiguration(configKey)) {
    configuration = vscode.workspace.getConfiguration(configKey)
    updateConfig()
  }
})

export function afterConfigUpdate(keys: ConfigKey[], handler: (config: typeof currentConfig) => void) {
  afterConfigHandlers.push([keys, handler])
}
