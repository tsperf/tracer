import * as vscode from 'vscode'
import { setTsPath } from './tsUtil'
import type { ConfigKey } from './constants'
import { configKeys, extPrefix } from './constants'

const currentConfig = {
  typescriptPath: '',
  typescriptPathMode: 'vscode-builtin',
  benchmarkIterations: 3,
  restartTsserverOnIteration: false,
  allIdentifiers: false,
  // eslint-disable-next-line no-template-curly-in-string
  traceCmd: 'npx tsc --generateTrace ${traceDir}',
  traceTimeThresholds: { info: 1, warning: -1, error: -1 },
  traceTypeThresholds: { info: 1, warning: -1, error: -1 },
  traceTotalTypeThresholds: { info: 1, warning: -1, error: -1 },
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

interface Thresholds {
  info: number
  warning: number
  error: number
}
function isThresholds(x: unknown): x is Thresholds {
  return x !== null && x !== undefined && typeof x === 'object'
    && 'info' in x && 'warning' in x && 'error' in x
    && typeof x.info === 'number' && typeof x.warning === 'number' && typeof x.error === 'number'
}

const configValidate = {
  typescriptPath: isString,
  typescriptPathMode: isString,
  benchmarkIterations: isNumber,
  restartTsserverOnIteration: isBoolean,
  allIdentifiers: isBoolean,
  traceCmd: isString,
  traceTimeThresholds: isThresholds,
  traceTypeThresholds: isThresholds,
  traceTotalTypeThresholds: isThresholds,
} satisfies Record<ConfigKey, any>

function noop() {
}

const configHandlers = {
  typescriptPath: (_value: string) => { currentConfig.typescriptPathMode = '!ForceUpdate' },
  typescriptPathMode: (value: string) => { setTsPath(value, currentConfig.typescriptPath) },
  benchmarkIterations: noop,
  restartTsserverOnIteration: noop,
  allIdentifiers: noop,
  traceCmd: noop,
  traceTimeThresholds: noop,
  traceTypeThresholds: noop,
  traceTotalTypeThresholds: noop,
} satisfies Record<ConfigKey, any>

let configuration = vscode.workspace.getConfiguration(extPrefix)

const afterConfigHandlers: [keys: ConfigKey[], handler: (config: typeof currentConfig) => void][] = []

export function updateConfig(opts?: { force?: ConfigKey[] }) {
  const changedKeys: ConfigKey[] = []
  for (const key of configKeys) {
    let newValue = configuration.get(key)
    if (opts?.force?.includes(key) || (newValue !== undefined && newValue !== currentConfig[key])) {
      newValue ??= currentConfig[key]
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
  if (change.affectsConfiguration(extPrefix)) {
    configuration = vscode.workspace.getConfiguration(extPrefix)
    updateConfig()
  }
})

export function afterConfigUpdate(keys: ConfigKey[], handler: (config: typeof currentConfig) => void) {
  afterConfigHandlers.push([keys, handler])
}
