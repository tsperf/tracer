import * as vscode from 'vscode'
import { getStatsFromTree } from '../traceTree'
import { getCurrentConfig } from '../configuration'

interface TypeSuggestion {
  title: string
  kind: vscode.CodeActionKind
  edit: (document: vscode.TextDocument, range: vscode.Range) => vscode.WorkspaceEdit | undefined
  isApplicable: (text: string) => boolean
}

const suggestions: TypeSuggestion[] = [
  {
    title: 'Extract type alias for complex type',
    kind: vscode.CodeActionKind.QuickFix,
    isApplicable: (text) => {
      // Detect complex union/intersection types
      const pipeCount = (text.match(/\|/g) || []).length
      const ampersandCount = (text.match(/&/g) || []).length
      return pipeCount >= 3 || ampersandCount >= 3 || text.length > 80
    },
    edit: (document, range) => {
      const text = document.getText(range)
      if (!text.trim())
        return undefined

      const aliasName = `ExtractedType`
      const workspaceEdit = new vscode.WorkspaceEdit()

      // Replace the complex type with an alias reference
      workspaceEdit.replace(document.uri, range, aliasName)

      // Add type alias at the top of the file (after imports)
      const lineCount = document.lineCount
      let insertLine = 0
      for (let i = 0; i < lineCount; i++) {
        const lineText = document.lineAt(i).text
        if (lineText.startsWith('import ') || lineText.trim() === '' || lineText.startsWith('//') || lineText.startsWith('/*')) {
          insertLine = i + 1
        }
        else {
          break
        }
      }

      const insertPos = new vscode.Position(insertLine, 0)
      workspaceEdit.insert(document.uri, insertPos, `type ${aliasName} = ${text}\n\n`)

      return workspaceEdit
    },
  },
  {
    title: 'Consider using `satisfies` for type validation',
    kind: vscode.CodeActionKind.QuickFix,
    isApplicable: (text) => {
      // Detect type annotation on object literals
      return /:\s*\{[^}]*\}\s*=/.test(text) || /:\s*\w+\s*=\s*\{/.test(text)
    },
    edit: (document, range) => {
      const text = document.getText(range)
      // Replace `: Type = expr` with `= expr satisfies Type`
      const match = text.match(/^([^:]+):\s*(\w+(?:<[^>]+>)?)\s*=\s*(.+)$/s)
      if (!match)
        return undefined

      const [, prefix, typeName, expression] = match
      const workspaceEdit = new vscode.WorkspaceEdit()
      workspaceEdit.replace(document.uri, range, `${prefix}= ${expression.trim()} satisfies ${typeName}`)
      return workspaceEdit
    },
  },
  {
    title: 'Add explicit type annotation to reduce inference cost',
    kind: vscode.CodeActionKind.QuickFix,
    isApplicable: (text) => {
      // Detect variable declarations without type annotations
      return /^(const|let|var)\s+\w+\s*=/.test(text.trim()) && !text.includes(':')
    },
    edit: (document, range) => {
      const text = document.getText(range)
      const match = text.match(/^(const|let|var)\s+(\w+)\s*=\s*(.+)$/s)
      if (!match)
        return undefined

      const [, keyword, name, _expression] = match
      const workspaceEdit = new vscode.WorkspaceEdit()

      // Suggest adding `: typeof` annotation
      workspaceEdit.replace(document.uri, range, `${keyword} ${name}: typeof ${name} = ${_expression.trim()}`)
      return workspaceEdit
    },
  },
]

export function initSuggestionProvider(ctx: vscode.ExtensionContext): void {
  const provider: vscode.CodeActionProvider = {
    provideCodeActions(document, range, context) {
      const config = getCurrentConfig()
      if (!config.enableTraceMetrics)
        return undefined

      // Only provide suggestions for TypeScript files
      if (document.languageId !== 'typescript' && document.languageId !== 'typescriptreact')
        return undefined

      // Check if this position has trace data indicating a slow type
      const stats = getStatsFromTree(document.fileName)
      const pos = document.offsetAt(range.start)
      const relevantStats = stats.filter(
        s => pos >= s.pos && pos <= s.end && s.dur / 1000 > (config.traceTimeThresholds.info || 1),
      )

      if (relevantStats.length === 0)
        return undefined

      const text = document.getText(range)
      const actions: vscode.CodeAction[] = []

      for (const suggestion of suggestions) {
        if (suggestion.isApplicable(text)) {
          const action = new vscode.CodeAction(suggestion.title, suggestion.kind)
          const edit = suggestion.edit(document, range)
          if (edit) {
            action.edit = edit
            action.diagnostics = context.diagnostics
            actions.push(action)
          }
        }
      }

      return actions.length > 0 ? actions : undefined
    },
  }

  ctx.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ['typescript', 'typescriptreact'],
      provider,
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] },
    ),
  )
}
