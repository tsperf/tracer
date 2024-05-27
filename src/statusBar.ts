import * as vscode from 'vscode'

let bar: vscode.StatusBarItem

const state = {
  tracing: false,
  traceError: false,
  projectName: '',
  saveName: '',
}

export function setStatusBarState<T extends keyof typeof state>(key: T, value: (typeof state)[T]) {
  state[key] = value
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
  let text = `${state.projectName}/${state.saveName}`
  if (state.tracing)
    text += '$(loading~spin)'

  if (state.traceError)
    text += '$(error)'

  bar.text = text
}
