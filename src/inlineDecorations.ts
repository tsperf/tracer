import * as vscode from 'vscode'
import { getCurrentConfig } from './configuration'

interface ComplexityInfo {
  line: number
  startChar: number
  endChar: number
  durationMs: number
  proportionalTime: number
  identifierText: string
  types?: number
  totalTypes?: number
}

let decorationTypes: {
  error: vscode.TextEditorDecorationType
  warning: vscode.TextEditorDecorationType
  info: vscode.TextEditorDecorationType
  hint: vscode.TextEditorDecorationType
}
let isEnabled = true

export function initInlineDecorations(ctx: vscode.ExtensionContext): void {
  decorationTypes = {
    error: vscode.window.createTextEditorDecorationType({
      after: {
        color: '#f44747',
        fontWeight: 'normal',
        fontStyle: 'italic',
        margin: '0 0 0 1em',
      },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
    }),
    warning: vscode.window.createTextEditorDecorationType({
      after: {
        color: '#cca700',
        fontWeight: 'normal',
        fontStyle: 'italic',
        margin: '0 0 0 1em',
      },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
    }),
    info: vscode.window.createTextEditorDecorationType({
      after: {
        color: '#75beff',
        fontWeight: 'normal',
        fontStyle: 'italic',
        margin: '0 0 0 1em',
      },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
    }),
    hint: vscode.window.createTextEditorDecorationType({
      after: {
        color: '#608b4e',
        fontWeight: 'normal',
        fontStyle: 'italic',
        margin: '0 0 0 1em',
      },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
    }),
  }

  for (const dt of Object.values(decorationTypes)) {
    ctx.subscriptions.push(dt)
  }
}

export function updateInlineDecorations(editor: vscode.TextEditor, complexities: ComplexityInfo[]): void {
  if (!isEnabled || !decorationTypes) return

  const config = getCurrentConfig()
  if (!config.enableRealtimeMetrics && !config.enableTraceMetrics) return

  const errorDecos: vscode.DecorationOptions[] = []
  const warningDecos: vscode.DecorationOptions[] = []
  const infoDecos: vscode.DecorationOptions[] = []
  const hintDecos: vscode.DecorationOptions[] = []

  for (const c of complexities) {
    const range = new vscode.Range(c.line, c.startChar, c.line, c.endChar)
    const percentage = Math.round(c.proportionalTime * 100) - 100
    const sign = percentage > 0 ? '+' : ''
    const typeInfo = c.types || c.totalTypes ? ` | ${c.types || 0}/${c.totalTypes || 0} types` : ''
    const text = `\u00A0${Math.round(c.durationMs)}ms (${sign}${percentage}%)${typeInfo}`

    const deco: vscode.DecorationOptions = {
      range,
      renderOptions: {
        after: {
          contentText: text,
        },
      },
    }

    if (c.proportionalTime > 2) {
      errorDecos.push(deco)
    }
    else if (c.proportionalTime > 1.5) {
      warningDecos.push(deco)
    }
    else if (c.proportionalTime > 1.2) {
      infoDecos.push(deco)
    }
    else {
      hintDecos.push(deco)
    }
  }

  editor.setDecorations(decorationTypes.error, errorDecos)
  editor.setDecorations(decorationTypes.warning, warningDecos)
  editor.setDecorations(decorationTypes.info, infoDecos)
  editor.setDecorations(decorationTypes.hint, hintDecos)
}

export function clearInlineDecorations(): void {
  if (!decorationTypes) return
  for (const editor of vscode.window.visibleTextEditors) {
    editor.setDecorations(decorationTypes.error, [])
    editor.setDecorations(decorationTypes.warning, [])
    editor.setDecorations(decorationTypes.info, [])
    editor.setDecorations(decorationTypes.hint, [])
  }
}

export function setInlineDecorationsEnabled(enabled: boolean): void {
  isEnabled = enabled
  if (!enabled) clearInlineDecorations()
}
