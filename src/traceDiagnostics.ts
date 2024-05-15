import * as vscode from 'vscode'

let diagnosticCollection: vscode.DiagnosticCollection

export function initDiagnostics(ctx: vscode.ExtensionContext): void {
  diagnosticCollection
      = vscode.languages.createDiagnosticCollection('tsperf.tracer')
  ctx.subscriptions.push(diagnosticCollection)
}

export function clearTaceDiagnostics() {
  if (diagnosticCollection)
    diagnosticCollection.clear()
}

export async function addTraceDiagnostic(
  fileName: string,
  pos: number,
  end: number,
  duration: number,
) {
  const uri = vscode.Uri.file(fileName)
  const document = await vscode.workspace.openTextDocument(uri)
  const msg = `check time ${Math.round(duration / 1000) / 1000}`
  const startPos = document.positionAt(pos)
  const endPos = document.positionAt(end)
  const range = new vscode.Range(startPos, endPos)
  const diagnostics = [...(diagnosticCollection.get(uri) ?? [])]
  diagnostics.push(
    new vscode.Diagnostic(range, msg, vscode.DiagnosticSeverity.Warning),
  )
  diagnosticCollection.set(uri, diagnostics)
}

let durationWarning = 1 * 1000 * 1000
export function getDurationWarning() {
  return durationWarning
}
const limitKey = 'checkTimeWarning'

function setLimit() {
  clearTaceDiagnostics()
  const configuration = vscode.workspace.getConfiguration('tsperf.tracer')
  durationWarning
      = (configuration.has(limitKey)
      ? (configuration.get(limitKey) as number)
      : 1)
      * 1000
      * 1000
}
setLimit()

vscode.workspace.onDidChangeConfiguration((e) => {
  if (e.affectsConfiguration('tsperf.tracer'))
    setLimit()
})

const configuration = vscode.workspace.getConfiguration('tsperf.tracer')
export const serverPort = configuration.get<number>('port') ?? 3000
