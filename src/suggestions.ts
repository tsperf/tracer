import * as vscode from 'vscode'

interface ComplexitySuggestion {
  type: 'simplify-type' | 'extract-type' | 'reduce-depth' | 'use-interface' | 'avoid-inference'
  message: string
  detail: string
}

export function getSuggestions(durationMs: number, proportionalTime: number, identifierText: string, types?: number, totalTypes?: number): ComplexitySuggestion[] {
  const suggestions: ComplexitySuggestion[] = []

  if (proportionalTime > 2 && types && types > 100) {
    suggestions.push({
      type: 'simplify-type',
      message: `Type "${identifierText}" instantiates ${types} types — consider simplifying`,
      detail: 'Complex types with many instantiations slow down the TypeScript compiler. Consider breaking them into simpler, composable types.',
    })
  }

  if (proportionalTime > 1.5 && totalTypes && totalTypes > 500) {
    suggestions.push({
      type: 'extract-type',
      message: `Type "${identifierText}" creates ${totalTypes} total types — consider extracting subtypes`,
      detail: 'When a type creates many transitive types, extracting parts into named interfaces can reduce the total type count and improve compilation speed.',
    })
  }

  if (durationMs > 50) {
    suggestions.push({
      type: 'reduce-depth',
      message: `Type "${identifierText}" takes ${Math.round(durationMs)}ms to check — consider reducing nesting depth`,
      detail: 'Deeply nested conditional types, mapped types, and template literal types can be expensive. Consider flattening the type structure.',
    })
  }

  if (proportionalTime > 1.2 && identifierText.match(/^[a-z]/)) {
    suggestions.push({
      type: 'use-interface',
      message: `Consider using an explicit interface instead of inferred type for "${identifierText}"`,
      detail: 'Explicit interfaces are faster to check than complex inferred types. If the type is inferred from a complex expression, consider annotating it with a named interface.',
    })
  }

  if (proportionalTime > 1.5 && identifierText.includes('ReturnType') || identifierText.includes('Parameters') || identifierText.includes('Extract') || identifierText.includes('Exclude')) {
    suggestions.push({
      type: 'avoid-inference',
      message: `Utility type "${identifierText}" is slow — consider caching the result`,
      detail: 'TypeScript utility types like ReturnType, Parameters, Extract, and Exclude can be expensive when applied to complex types. Consider creating a type alias to cache the result.',
    })
  }

  return suggestions
}

export function registerSuggestionCodeActions(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file', language: 'typescript' },
      new ComplexitySuggestionProvider(),
      {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
      },
    ),
  )

  ctx.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file', language: 'typescriptreact' },
      new ComplexitySuggestionProvider(),
      {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
      },
    ),
  )
}

class ComplexitySuggestionProvider implements vscode.CodeActionProvider {
  provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = []

    const diagnostics = vscode.languages.getDiagnostics(document.uri)
    const tsperfDiagnostics = diagnostics.filter(d => d.source === 'tsperf' && range.contains(d.range))

    for (const diagnostic of tsperfDiagnostics) {
      const action = new vscode.CodeAction(
        '💡 TsPerf: View type complexity optimization tips',
        vscode.CodeActionKind.QuickFix,
      )
      action.diagnostics = [diagnostic]
      action.command = {
        command: 'tsperf.tracer.showComplexityTips',
        title: 'Show Type Complexity Tips',
        arguments: [document.uri.fsPath, diagnostic.range.start.line],
      }
      actions.push(action)
    }

    return actions
  }
}
