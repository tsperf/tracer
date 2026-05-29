import * as vscode from 'vscode'

let bar: vscode.StatusBarItem
let metricsBar: vscode.StatusBarItem

const statusBarState = {
  tracing: false,
  traceError: false,
  projectName: '',
  saveName: '',
}

interface MetricsSummary {
  slowTypes: number
  avgDuration: number
  worstDuration: number
}

let metrics: MetricsSummary | undefined

export function setStatusBarState<T extends keyof typeof statusBarState>(key: T, value: (typeof statusBarState)[T]) {
  statusBarState[key] = value
  updateText()
}

export function updateMetricsBar(summary: MetricsSummary): void {
  metrics = summary
  updateMetricsText()
}

export function initStatusBar(extensionContext: vscode.ExtensionContext) {
  bar = vscode.window.createStatusBarItem('tsperf.tracer.bar', vscode.StatusBarAlignment.Left, 50)
  extensionContext.subscriptions.push(bar)

  bar.text = '$(clock) TsPerf'
  bar.tooltip = 'Click to run trace'
  bar.name = 'Tracer'
  bar.command = 'tsperf.tracer.runTrace'
  bar.show()

  metricsBar = vscode.window.createStatusBarItem('tsperf.tracer.metrics', vscode.StatusBarAlignment.Left, 49)
  extensionContext.subscriptions.push(metricsBar)

  metricsBar.name = 'TsPerf Metrics'
  metricsBar.tooltip = 'Type complexity metrics - Click to toggle inline decorations'
  metricsBar.command = 'tsperf.tracer.toggleInlineDecorations'
  metricsBar.text = '$(pulse) TsPerf'
  metricsBar.show()
}

function updateText() {
  let text = '$(clock) '
  if (statusBarState.projectName) {
    text += `${statusBarState.projectName}`
  }
  else {
    text += 'TsPerf'
  }

  if (statusBarState.tracing)
    text += ' $(loading~spin)'

  if (statusBarState.traceError)
    text += ' $(error)'

  bar.text = text
}

function updateMetricsText() {
  if (!metrics || metrics.slowTypes === 0) {
    metricsBar.text = '$(check) No slow types'
    metricsBar.backgroundColor = undefined
    return
  }

  const { slowTypes, avgDuration, worstDuration } = metrics

  if (worstDuration > 100) {
    metricsBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground')
  }
  else if (worstDuration > 50) {
    metricsBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground')
  }
  else {
    metricsBar.backgroundColor = undefined
  }

  metricsBar.text = `$(pulse) ${slowTypes} slow | avg ${Math.round(avgDuration)}ms | worst ${Math.round(worstDuration)}ms`
}
