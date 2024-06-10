import * as vscode from 'vscode'
import { metricsRunning } from './appState'

let bar: vscode.StatusBarItem

const statusBarState = {
  traceRunning: false,
  metricsRunning: false,
  traceError: false,
  projectName: '',
  saveName: '',
}

export function setStatusBarState<T extends keyof typeof statusBarState>(key: T, value: (typeof statusBarState)[T]) {
  statusBarState[key] = value
  updateText()
}

export function initStatusBar(extensionContext: vscode.ExtensionContext) {
  bar = vscode.window.createStatusBarItem('tsper.tracer.bar', vscode.StatusBarAlignment.Left)
  extensionContext.subscriptions.push(bar)

  bar.text = 'Tracer'
  bar.tooltip = 'Click to run trace'
  bar.name = 'Tracer'
  bar.command = 'tsperf.tracer.runTrace'
  bar.show()
}

function updateText() {
  let text = ''
  if (statusBarState.metricsRunning)
    text += '$(loading~spin)'

  text += `${statusBarState.projectName}/${statusBarState.saveName}`

  if (statusBarState.traceRunning)
    text += '$(loading~spin)'

  if (statusBarState.traceError)
    text += '$(error)'

  bar.text = text
}
