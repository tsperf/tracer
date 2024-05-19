import * as vscode from 'vscode'
import type { FileStat, FileStats } from '../messages/src/messages'
import { postMessage } from './webview'

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
  const fileName = event?.document?.fileName
  if (fileName)
    postMessage({ message: 'fileStats', fileName: event?.document.fileName, stats: [] })
})

export function clearTaceDiagnostics() {
  fileStatus.clear()
  if (diagnosticCollection)
    diagnosticCollection.clear()
}

export async function addTraceDiagnostics({ fileName, stats }: FileStats) {
  const uri = vscode.Uri.file(fileName)
  if (fileStatus.get(fileName) === 'dirty') {
    diagnosticCollection.set(uri, [])
    return
  }

  fileStatus.set(fileName, 'clean')

  const document = await vscode.workspace.openTextDocument(uri)

  const diagnostics = []
  for (const stat of stats) {
    const diagnostic = fileStatToDiagnostic(stat, document)
    if (diagnostic)
      diagnostics.push(diagnostic)
  }
  diagnosticCollection.set(uri, diagnostics)
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
  dur: [20, 10, 5],
}

function getSeverity(measure: Partial<{ [k in keyof typeof severityThresholds]: number }>) {
  const [thresholdType, value] = Object.entries(measure)[0]
  const thresholds = severityThresholds[thresholdType as keyof typeof severityThresholds]

  const index = thresholds.findIndex(x => x >= 0 && x <= value / 1000)
  return index === -1 ? 99 : index
}
