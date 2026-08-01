import * as vscode from 'vscode'
import type { server } from 'typescript'
import { getCurrentConfig } from '../configuration'

let resultDecorationType: vscode.TextEditorDecorationType

export function initTraceExpression(ctx: vscode.ExtensionContext): void {
  resultDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 1em',
      textDecoration: 'none',
    },
  })
  ctx.subscriptions.push(resultDecorationType)

  ctx.subscriptions.push(
    vscode.commands.registerCommand('tsperf.tracer.traceExpression', traceExpression),
  )
}

async function traceExpression(): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor)
    return

  const selection = editor.selection
  if (selection.isEmpty) {
    vscode.window.showInformationMessage('Select an expression to trace its type complexity')
    return
  }

  const fileName = editor.document.fileName
  const startLine = selection.start.line + 1
  const startOffset = selection.start.character + 1

  const config = getCurrentConfig()
  if (!config.enableRealtimeMetrics) {
    vscode.window.showInformationMessage('Enable realtime metrics to trace expressions')
    return
  }

  try {
    const [quickInfoResult, completionsResult] = await Promise.all([
      measureQuickInfo(fileName, startLine, startOffset),
      measureCompletions(fileName, startLine, startOffset),
    ])

    const quickInfoDuration = quickInfoResult.duration
    const completionsDuration = completionsResult.duration
    const avgDuration = (quickInfoDuration + completionsDuration) / 2

    const severity = avgDuration > 200 ? 'error' : avgDuration > 50 ? 'warning' : 'info'
    const color = severity === 'error' ? 'rgba(255,50,50,0.9)' : severity === 'warning' ? 'rgba(255,180,0,0.8)' : 'rgba(100,200,100,0.7)'

    const text = editor.document.getText(selection)
    const hoverMessage = [
      '**Expression Trace Result**',
      '',
      `Expression: \`${text}\``,
      `Quick Info: ${Math.round(quickInfoDuration)}ms`,
      `Completions: ${Math.round(completionsDuration)}ms`,
      `Average: ${Math.round(avgDuration)}ms`,
      '',
      quickInfoResult.typeName ? `Type: \`${quickInfoResult.typeName}\`` : '',
    ].filter(Boolean).join('\n')

    const decoration = {
      range: selection,
      hoverMessage: new vscode.MarkdownString(hoverMessage),
      renderOptions: {
        after: {
          contentText: ` ${Math.round(avgDuration)}ms`,
          color,
        },
      },
    }

    editor.setDecorations(resultDecorationType, [decoration])

    // Auto-clear after 5 seconds
    setTimeout(() => {
      if (vscode.window.activeTextEditor === editor)
        editor.setDecorations(resultDecorationType, [])
    }, 5000)
  }
  catch (e) {
    vscode.window.showErrorMessage(`Trace expression failed: ${e}`)
  }
}

interface MeasurementResult {
  duration: number
  typeName?: string
}

async function measureQuickInfo(fileName: string, line: number, offset: number): Promise<MeasurementResult> {
  const start = performance.now()
  const result = await vscode.commands.executeCommand('typescript.tsserverRequest', 'quickinfo-full', {
    file: fileName,
    line,
    offset,
  } satisfies server.protocol.FileLocationRequestArgs) as server.protocol.QuickInfoResponse
  const duration = performance.now() - start

  return {
    duration,
    typeName: result?.body?.displayString,
  }
}

async function measureCompletions(fileName: string, line: number, offset: number): Promise<MeasurementResult> {
  const start = performance.now()
  const result = await vscode.commands.executeCommand('typescript.tsserverRequest', 'completionInfo', {
    file: fileName,
    line,
    offset,
  } satisfies server.protocol.CompletionsRequestArgs) as server.protocol.CompletionInfoResponse
  const duration = performance.now() - start

  return {
    duration,
    typeName: result?.body?.entries?.length ? `${result.body.entries.length} completions` : undefined,
  }
}
