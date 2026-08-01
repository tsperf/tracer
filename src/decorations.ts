import * as vscode from 'vscode'
import type { FileStat } from '../shared/src/messages'
import { afterConfigUpdate, getCurrentConfig } from './configuration'

let decorationTypes: vscode.TextEditorDecorationType[] = []
let enableDecorations = true

const severityColors = {
  error: 'rgba(255, 50, 50, 0.15)',
  warning: 'rgba(255, 180, 0, 0.12)',
  info: 'rgba(100, 200, 100, 0.08)',
}

const gutterColors = {
  error: 'rgba(255, 50, 50, 0.8)',
  warning: 'rgba(255, 180, 0, 0.7)',
  info: 'rgba(100, 200, 100, 0.5)',
}

function createDecorationType(severity: 'error' | 'warning' | 'info'): vscode.TextEditorDecorationType {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor: severityColors[severity],
    gutterIconPath: createGutterIcon(gutterColors[severity]),
    gutterIconSize: 'contain',
    overviewRulerColor: gutterColors[severity],
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    rangeBehavior: vscode.DecorRangeBehavior.ClosedClosed,
    after: {
      margin: '0 0 0 1em',
      textDecoration: 'none',
    },
  })
}

function createGutterIcon(color: string): vscode.Uri {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="4" height="16" rx="2" fill="${color}"/></svg>`
  return vscode.Uri.parse(`data:image/svg+xml,${encodeURIComponent(svg)}`)
}

const infoDecoration = createDecorationType('info')
const warningDecoration = createDecorationType('warning')
const errorDecoration = createDecorationType('error')

decorationTypes = [infoDecoration, warningDecoration, errorDecoration]

interface DecorationInfo {
  range: vscode.Range
  severity: 'info' | 'warning' | 'error'
  hoverMessage: string
  afterText: string
}

function getSeverityFromThresholds(dur: number, types: number, totalTypes: number): 'info' | 'warning' | 'error' | undefined {
  const config = getCurrentConfig()
  const durMs = dur / 1000
  const thresholds = config.traceTimeThresholds
  if (thresholds.error >= 0 && durMs >= thresholds.error)
    return 'error'
  if (thresholds.warning >= 0 && durMs >= thresholds.warning)
    return 'warning'
  if (thresholds.info >= 0 && durMs >= thresholds.info)
    return 'info'

  const typeThresholds = config.traceTypeThresholds
  if (typeThresholds.error >= 0 && types >= typeThresholds.error)
    return 'error'
  if (typeThresholds.warning >= 0 && types >= typeThresholds.warning)
    return 'warning'
  if (typeThresholds.info >= 0 && types >= typeThresholds.info)
    return 'info'

  return undefined
}

export function updateDecorations(editor: vscode.TextEditor, stats: FileStat[]): void {
  if (!enableDecorations || !getCurrentConfig().enableTraceMetrics)
    return

  const decorations: Record<string, DecorationInfo[]> = {
    info: [],
    warning: [],
    error: [],
  }

  const document = editor.document
  const seen = new Set<number>()

  for (const stat of stats) {
    if (seen.has(stat.pos))
      continue
    seen.add(stat.pos)

    const severity = getSeverityFromThresholds(stat.dur, stat.types, stat.totalTypes)
    if (!severity)
      continue

    const startPos = document.positionAt(stat.pos + 1)
    const endPos = document.positionAt(stat.end)
    const range = new vscode.Range(startPos, endPos)

    const durationMs = Math.round(stat.dur) / 1000
    const hoverMessage = `**Type Complexity**\n\nCheck time: ${durationMs}ms\nTypes: ${stat.types}\nTotal types: ${stat.totalTypes}`
    const afterText = ` ${durationMs}ms`

    decorations[severity].push({ range, severity, hoverMessage, afterText })
  }

  editor.setDecorations(infoDecoration, decorations.info.map(d => ({
    range: d.range,
    hoverMessage: new vscode.MarkdownString(d.hoverMessage),
    renderOptions: { after: { contentText: d.afterText, color: 'rgba(100, 200, 100, 0.7)' } },
  })))

  editor.setDecorations(warningDecoration, decorations.warning.map(d => ({
    range: d.range,
    hoverMessage: new vscode.MarkdownString(d.hoverMessage),
    renderOptions: { after: { contentText: d.afterText, color: 'rgba(255, 180, 0, 0.8)' } },
  })))

  editor.setDecorations(errorDecoration, decorations.error.map(d => ({
    range: d.range,
    hoverMessage: new vscode.MarkdownString(d.hoverMessage),
    renderOptions: { after: { contentText: d.afterText, color: 'rgba(255, 50, 50, 0.9)' } },
  })))
}

export function clearDecorations(): void {
  for (const editor of vscode.window.visibleTextEditors) {
    for (const decorationType of decorationTypes) {
      editor.setDecorations(decorationType, [])
    }
  }
}

export function initDecorations(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(infoDecoration, warningDecoration, errorDecoration)

  afterConfigUpdate(['enableTraceMetrics', 'enableInlineDecorations'], (config) => {
    enableDecorations = config.enableInlineDecorations ?? true
    if (!enableDecorations || !config.enableTraceMetrics)
      clearDecorations()
  })
}
