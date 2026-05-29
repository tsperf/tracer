import * as vscode from 'vscode'

interface ComplexityEntry {
  fileName: string
  line: number
  identifier: string
  durationMs: number
  proportionalTime: number
  types?: number
  totalTypes?: number
}

class ComplexityOverviewProvider implements vscode.TreeDataProvider<ComplexityItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ComplexityItem | undefined | null>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  private entries: ComplexityEntry[] = []
  private sortBy: 'duration' | 'proportional' | 'name' = 'proportional'

  refresh(entries: ComplexityEntry[]): void {
    this.entries = entries
    this._onDidChangeTreeData.fire(undefined)
  }

  setSortBy(sortBy: 'duration' | 'proportional' | 'name'): void {
    this.sortBy = sortBy
    this._onDidChangeTreeData.fire(undefined)
  }

  getTreeItem(element: ComplexityItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: ComplexityItem): ComplexityItem[] {
    if (element) return []

    const sorted = [...this.entries].sort((a, b) => {
      if (this.sortBy === 'duration') return b.durationMs - a.durationMs
      if (this.sortBy === 'proportional') return b.proportionalTime - a.proportionalTime
      return a.identifier.localeCompare(b.identifier)
    })

    return sorted.map((entry) => {
      const percentage = Math.round(entry.proportionalTime * 100) - 100
      const sign = percentage > 0 ? '+' : ''
      const icon = entry.proportionalTime > 2
        ? new vscode.ThemeIcon('error', new vscode.ThemeColor('errorForeground'))
        : entry.proportionalTime > 1.5
          ? new vscode.ThemeIcon('warning', new vscode.ThemeColor('problemsWarningIcon.foreground'))
          : new vscode.ThemeIcon('info', new vscode.ThemeColor('problemsInfoIcon.foreground'))

      const shortFile = entry.fileName.split(/[/\\]/).pop() || entry.fileName
      const label = `${entry.identifier} — ${Math.round(entry.durationMs)}ms (${sign}${percentage}%)`
      const description = `${shortFile}:${entry.line + 1}`

      const item = new ComplexityItem(label, vscode.TreeItemCollapsibleState.None)
      item.description = description
      item.iconPath = icon
      item.tooltip = `${entry.fileName}:${entry.line + 1}\nDuration: ${Math.round(entry.durationMs)}ms\nProportional: ${sign}${percentage}%${entry.types ? `\nTypes: ${entry.types}/${entry.totalTypes}` : ''}`
      item.command = {
        command: 'tsperf.tracer.goToComplexity',
        title: 'Go to Complexity',
        arguments: [entry.fileName, entry.line],
      }

      return item
    })
  }
}

class ComplexityItem extends vscode.TreeItem {
  constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState)
  }
}

let provider: ComplexityOverviewProvider
let treeView: vscode.TreeView<ComplexityItem>

export function initComplexityOverview(ctx: vscode.ExtensionContext): void {
  provider = new ComplexityOverviewProvider()

  treeView = vscode.window.createTreeView('tsperf.complexityOverview', {
    treeDataProvider: provider,
    showCollapseAll: false,
  })

  ctx.subscriptions.push(treeView)

  ctx.subscriptions.push(
    vscode.commands.registerCommand('tsperf.tracer.goToComplexity', (fileName: string, line: number) => {
      const uri = vscode.Uri.file(fileName)
      vscode.workspace.openTextDocument(uri).then((doc) => {
        vscode.window.showTextDocument(doc, {
          selection: new vscode.Range(line, 0, line, 0),
        })
      })
    }),
  )

  ctx.subscriptions.push(
    vscode.commands.registerCommand('tsperf.tracer.sortByDuration', () => {
      provider.setSortBy('duration')
    }),
  )

  ctx.subscriptions.push(
    vscode.commands.registerCommand('tsperf.tracer.sortByProportional', () => {
      provider.setSortBy('proportional')
    }),
  )

  ctx.subscriptions.push(
    vscode.commands.registerCommand('tsperf.tracer.sortByName', () => {
      provider.setSortBy('name')
    }),
  )
}

export function updateComplexityOverview(entries: ComplexityEntry[]): void {
  if (provider) provider.refresh(entries)
}

export { type ComplexityEntry }
