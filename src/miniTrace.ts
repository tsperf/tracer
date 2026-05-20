import { performance } from 'node:perf_hooks'
import * as vscode from 'vscode'
import type { server } from 'typescript'
import { getCurrentConfig } from './configuration'
import { log } from './logger'
import { type MiniTraceSample, formatMiniTraceReport } from './miniTraceReport'

function getTargetRange(editor: vscode.TextEditor) {
  if (!editor.selection.isEmpty)
    return editor.selection

  return editor.document.getWordRangeAtPosition(editor.selection.active)
}

function formatTargetLabel(text: string) {
  const compact = text.trim().replace(/\s+/g, ' ')
  if (!compact)
    return 'at cursor'

  if (compact.length <= 48)
    return `"${compact}"`

  return `"${compact.slice(0, 45)}..."`
}

async function timedRequest<T>(name: string, request: () => Thenable<T>) {
  const start = performance.now()
  const response = await request()
  const duration = performance.now() - start
  log({ miniTraceRequest: name, duration })
  return { response, duration }
}

async function measurePosition(fileName: string, line: number, offset: number): Promise<MiniTraceSample> {
  const [quickInfo, completions] = await Promise.all([
    timedRequest('quickinfo-full', () => vscode.commands.executeCommand(
      'typescript.tsserverRequest',
      'quickinfo-full',
      { file: fileName, line, offset } satisfies server.protocol.FileLocationRequestArgs,
    )),
    timedRequest('completionInfo', () => vscode.commands.executeCommand(
      'typescript.tsserverRequest',
      'completionInfo',
      { file: fileName, line, offset } satisfies server.protocol.CompletionsRequestArgs,
    )),
  ])

  if (!(quickInfo.response as server.protocol.QuickInfoResponse)?.success)
    log('mini trace quickinfo-full request did not succeed')

  if (!(completions.response as server.protocol.CompletionInfoResponse)?.success)
    log('mini trace completionInfo request did not succeed')

  return {
    quickInfoDuration: quickInfo.duration,
    completionsDuration: completions.duration,
  }
}

export async function measureSelectedExpression() {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showWarningMessage('Open a TypeScript file to measure an expression')
    return
  }

  if (editor.document.languageId !== 'typescript' && editor.document.languageId !== 'typescriptreact') {
    vscode.window.showWarningMessage('Mini trace measurements only run in TypeScript files')
    return
  }

  const range = getTargetRange(editor)
  if (!range) {
    vscode.window.showWarningMessage('Select an expression or place the cursor on an identifier')
    return
  }

  const { benchmarkIterations, restartTsserverOnIteration } = getCurrentConfig()
  const iterations = Math.max(1, benchmarkIterations)
  const position = range.start
  const label = formatTargetLabel(editor.document.getText(range))
  const samples: MiniTraceSample[] = []

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Measuring ${label}`,
    cancellable: false,
  }, async () => {
    for (let i = 0; i < iterations; i++) {
      if (restartTsserverOnIteration)
        await vscode.commands.executeCommand('typescript.restartTsServer')

      samples.push(await measurePosition(editor.document.fileName, position.line, position.character))
    }
  })

  vscode.window.showInformationMessage(formatMiniTraceReport({ label, samples }))
}
