import * as vscode from 'vscode'
import type { FileStat } from '../shared/src/messages'
import { getStatsFromTree } from '../shared/src/traceTree'
import { afterConfigUpdate, getCurrentConfig } from './configuration'

let diagnosticCollection: vscode.DiagnosticCollection

export function initDiagnostics(ctx: vscode.ExtensionContext): void {
  diagnosticCollection
      = vscode.languages.createDiagnosticCollection('tsperf.tracer')
  ctx.subscriptions.push(diagnosticCollection)
}

const fileStatus = new Map<string, 'dirty' | 'clean'>()

vscode.workspace.onDidChangeTextDocument((event) => {
  fileStatus.set(event.document.fileName, 'dirty')
})

vscode.window.onDidChangeActiveTextEditor((event) => {
  if (getCurrentConfig().traceTimeThresholds.info === -99)
    return

  const fileName = event?.document?.fileName
  if (fileName)
    addTraceDiagnostics(fileName, getStatsFromTree(fileName))
})

export function clearTaceDiagnostics() {
  fileStatus.clear()
  if (diagnosticCollection)
    diagnosticCollection.clear()
}
const averageThresholds = {
  dur: 10_000,
  types: 0,
  totalTypes: 0,
}

export async function addTraceDiagnostics(fileName: string, stats: FileStat[]) {
  const relative = getCurrentConfig().traceDiagnosticsRelative

  const uri = vscode.Uri.file(fileName)
  if (fileStatus.get(fileName) === 'dirty') {
    diagnosticCollection.set(uri, [])
    return
  }

  fileStatus.set(fileName, 'clean')

  const document = await vscode.workspace.openTextDocument(uri)

  let averages

  let toDiagnistic: typeof fileStatToDiagnostic | typeof fileStatToRelativeDiagnostic = fileStatToDiagnostic
  if (relative) {
    const durations = stats.map(x => x.dur).filter(x => x >= averageThresholds.dur)
    const types = stats.map(x => x.types).filter(x => x >= averageThresholds.types)
    const totalTypes = stats.map(x => x.totalTypes).filter(x => x >= averageThresholds.totalTypes)
    averages = {
      dur: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      types: types.length ? types.reduce((a, b) => a + b, 0) / types.length : 0,
      totalTypes: totalTypes.length ? totalTypes.reduce((a, b) => a + b, 0) / totalTypes.length : 0,
    }
    toDiagnistic = fileStatToRelativeDiagnostic
  }

  const diagnostics = []
  stats.sort((a, b) => a.pos === b.pos ? (b.end - b.pos) - (a.end - a.pos) : b.pos - a.pos)
  let lastPos = -9999
  for (const stat of stats) {
    if (lastPos === stat.pos)
      continue // do not create diagnostics for further checks at the same starting position

    const diagnostic = toDiagnistic(stat, document, averages!)
    if (diagnostic)
      diagnostics.push(diagnostic)

    lastPos = stat.pos
  }
  diagnosticCollection.set(uri, diagnostics)
}

function relativeString(value: number) {
  return `(${value > 0 ? '+' : ''}${Math.round(10000 * value) / 100}%)`
}

function relativeValue(value: number, average: number, averageThreshold: number) {
  return value / (average || averageThreshold || 1)
}

function fileStatToRelativeDiagnostic({ pos, end, dur, types, totalTypes }: FileStat, document: vscode.TextDocument, averages: { dur: number, types: number, totalTypes: number }) {
  if (!(types || totalTypes || dur))
    return undefined

  const relative = { dur: relativeValue(dur, averages.dur, averageThresholds.dur), types: relativeValue(types, averages.types, averageThresholds.types), totalTypes: relativeValue(totalTypes, averages.totalTypes, averageThresholds.totalTypes) }

  const severity = Math.min(Math.min(getRelativeSeverity({ types: relative.types }), getRelativeSeverity({ totalTypes: relative.totalTypes })), getRelativeSeverity({ dur: relative.dur }))
  if (severity > vscode.DiagnosticSeverity.Information)
    return

  const typeStr = types || totalTypes ? ` Types: ${types} / ${totalTypes} ${relativeString(relative.types)} / ${relativeString(relative.totalTypes)}` : ''

  const msg = `Check ms: ${Math.round(dur) / 1000} ${relativeString(relative.dur)} ${typeStr}`
  const startPos = document.positionAt(pos)
  const endPos = document.positionAt(end)
  const range = new vscode.Range(startPos, endPos)

  return new vscode.Diagnostic(range, msg, severity)
}

function fileStatToDiagnostic({ pos, end, dur, types, totalTypes }: FileStat, document: vscode.TextDocument) {
  if (!(types || totalTypes || dur))
    return undefined

  const severity = Math.min(Math.min(getSeverity({ types }), getSeverity({ totalTypes })), getSeverity({ dur }))
  if (severity > vscode.DiagnosticSeverity.Information)
    return

  const typeStr = types || totalTypes ? ` Types: ${types} / ${totalTypes}` : ''

  const msg = `Check ms: ${Math.round(dur) / 1000} ${typeStr}`
  const startPos = document.positionAt(pos)
  const endPos = document.positionAt(end)
  const range = new vscode.Range(startPos, endPos)

  return new vscode.Diagnostic(range, msg, severity)
}

// yes, I should be using the vscode.DiagnosticSeverity but that's much more painful and they are unlikely to change
const severityThresholds = {
  types: [-1, -1, -1],
  totalTypes: [-1, -1, -1],
  dur: [-1, -1, 1],
}

// yes, I should be using the vscode.DiagnosticSeverity but that's much more painful and they are unlikely to change
const severityRelativeThresholds = {
  types: [-1, -1, -1],
  totalTypes: [-1, -1, -1],
  dur: [-1, -1, 1],
}

afterConfigUpdate(['traceTimeThresholds', 'traceTypeThresholds', 'traceTotalTypeThresholds'], (config) => {
  severityThresholds.dur = [config.traceTimeThresholds.error, config.traceTimeThresholds.warning, config.traceTimeThresholds.info]
  severityThresholds.types = [config.traceTypeThresholds.error, config.traceTypeThresholds.warning, config.traceTypeThresholds.info]
  severityThresholds.totalTypes = [config.traceTotalTypeThresholds.error, config.traceTotalTypeThresholds.warning, config.traceTotalTypeThresholds.info]
})

afterConfigUpdate(['traceTimeRelativeThresholds', 'traceTypeRelativeThresholds', 'traceTotalTypeRelativeThresholds'], (config) => {
  severityRelativeThresholds.dur = [config.traceTimeRelativeThresholds.error, config.traceTimeRelativeThresholds.warning, config.traceTimeRelativeThresholds.info]
  severityRelativeThresholds.types = [config.traceTypeRelativeThresholds.error, config.traceTypeRelativeThresholds.warning, config.traceTypeRelativeThresholds.info]
  severityRelativeThresholds.totalTypes = [config.traceTotalTypeRelativeThresholds.error, config.traceTotalTypeRelativeThresholds.warning, config.traceTotalTypeRelativeThresholds.info]
})

function getSeverity(measure: Partial<{ [k in keyof typeof severityThresholds]: number }>) {
  const [thresholdType, value] = Object.entries(measure)[0]
  const thresholds = severityThresholds[thresholdType as keyof typeof severityThresholds]

  const index = thresholds.findIndex(x => x >= 0 && x <= value / 1000)
  return index === -1 ? 99 : index
}

function getRelativeSeverity(measure: Partial<{ [k in keyof typeof severityThresholds]: number }>) {
  const [thresholdType, value] = Object.entries(measure)[0]
  const thresholds = severityRelativeThresholds[thresholdType as keyof typeof severityRelativeThresholds]

  const index = thresholds.findIndex(x => x >= 0 && x <= value * 100)
  return index === -1 ? 99 : index
}
