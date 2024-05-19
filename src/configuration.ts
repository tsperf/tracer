import * as vscode from 'vscode'
import { setTsPath } from './tsUtil'

const configKeys = [
  'typescript-path',
  'typescript-path-mode',
  'benchmarkIterations',
  'restartTsserverOnIteration',
  'allIdentifiers',
  'traceCmd',
] as const

type ConfigKey = typeof configKeys[number]
const configKey = 'tsperf.tracer'

const currentConfig = {
  'typescript-path': '',
  'typescript-path-mode': 'vscode-builtin',
  'benchmarkIterations': 3,
  'restartTsserverOnIteration': false,
  'allIdentifiers': false,
  // eslint-disable-next-line no-template-curly-in-string
  'traceCmd': 'npx tsc --generateTrace ${traceDir}',
} satisfies Record<ConfigKey, any>

export function getCurrentConfig() {
  return { ...currentConfig }
}

function isString(x: unknown): x is string {
  return typeof x === 'string'
}

function isNumber(x: unknown): x is number {
  return typeof x === 'number'
}

function isBoolean(x: unknown): x is boolean {
  return typeof x === 'boolean'
}

const configValidate = {
  'typescript-path': isString,
  'typescript-path-mode': isString,
  'benchmarkIterations': isNumber,
  'restartTsserverOnIteration': isBoolean,
  'allIdentifiers': isBoolean,
  'traceCmd': isString,
} satisfies Record<ConfigKey, any>

function noop() {
}

const configHandlers = {
  'typescript-path': (_value: string) => { currentConfig['typescript-path-mode'] = '!ForceUpdate' },
  'typescript-path-mode': (value: string) => { setTsPath(value, currentConfig['typescript-path']) },
  'benchmarkIterations': noop,
  'restartTsserverOnIteration': noop,
  'allIdentifiers': noop,
  'traceCmd': noop,
} satisfies Record<ConfigKey, any>

let configuration = vscode.workspace.getConfiguration(configKey)

const afterConfigHandlers: [keys: ConfigKey[], handler: (config: typeof currentConfig) => void][] = []

export function updateConfig() {
  const changedKeys: ConfigKey[] = []
  for (const key of configKeys) {
    const newValue = configuration.get(key)
    if (newValue !== undefined && newValue !== currentConfig[key]) {
      changedKeys.push(key)
      if (!configValidate[key](newValue)) {
        vscode.window.showErrorMessage(`wrong type received for configuration item ${key}: ${newValue}`)
        break
      }
      currentConfig[key] = newValue as never
      configHandlers[key](newValue as never)
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
