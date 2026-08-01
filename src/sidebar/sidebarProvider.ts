import * as vscode from 'vscode'
import { getStatsFromTree } from '../traceTree'
import { getCurrentConfig } from '../configuration'
import { getWorkspacePath } from '../storage'
import { relative } from 'node:path'

export type HotSpotSeverity = 'error' | 'warning' | 'info'

export interface HotSpot {
  label: string
  description: string
  severity: HotSpotSeverity
  pos: number
  end: number
  dur: number
  types: number
  totalTypes: number
  fileName: string
}

export interface FileSummary {
  fileName: string
  relativePath: string
  totalCheckTime: number
  hotSpotCount: number
  maxSeverity: HotSpotSeverity
  hotSpots: HotSpot[]
}

export class SidebarProvider implements vscode.TreeDataProvider<SidebarItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SidebarItem | undefined | null>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  private summaries: FileSummary[] = []

  refresh(fileName?: string): void {
    if (fileName) {
      this.updateFileSummary(fileName)
    }
    else {
      this.summaries = []
      for (const editor of vscode.window.visibleTextEditors) {
        this.updateFileSummary(editor.document.fileName)
      }
    }
    this._onDidChangeTreeData.fire(undefined)
  }

  private updateFileSummary(fileName: string): void {
    const stats = getStatsFromTree(fileName)
    const workspacePath = getWorkspacePath()
    const relativePath = relative(workspacePath, fileName)

    const config = getCurrentConfig()
    if (!config.enableTraceMetrics) {
      this.summaries = this.summaries.filter(s => s.fileName !== fileName)
      return
    }

    const hotSpots: HotSpot[] = []
    for (const stat of stats) {
      const severity = this.getSeverity(stat.dur, stat.types, stat.totalTypes)
      if (!severity)
        continue

      hotSpots.push({
        label: this.getPositionLabel(fileName, stat.pos),
        description: `${Math.round(stat.dur / 100) / 10}ms`,
        severity,
        pos: stat.pos,
        end: stat.end,
        dur: stat.dur,
        types: stat.types,
        totalTypes: stat.totalTypes,
        fileName,
      })
    }

    hotSpots.sort((a, b) => b.dur - a.dur)

    const totalCheckTime = stats.reduce((sum, s) => sum + s.dur, 0)
    const maxSeverity = hotSpots.length > 0
      ? hotSpots.some(h => h.severity === 'error') ? 'error'
        : hotSpots.some(h => h.severity === 'warning') ? 'warning' : 'info'
      : 'info'

    const summary: FileSummary = {
      fileName,
      relativePath,
      totalCheckTime,
      hotSpotCount: hotSpots.length,
      maxSeverity,
      hotSpots,
    }

    const existing = this.summaries.findIndex(s => s.fileName === fileName)
    if (existing >= 0)
      this.summaries[existing] = summary
    else
      this.summaries.push(summary)

    this.summaries.sort((a, b) => b.totalCheckTime - a.totalCheckTime)
  }

  private getSeverity(dur: number, types: number, totalTypes: number): HotSpotSeverity | undefined {
    const config = getCurrentConfig()
    const durMs = dur / 1000
    const t = config.traceTimeThresholds
    if (t.error >= 0 && durMs >= t.error) return 'error'
    if (t.warning >= 0 && durMs >= t.warning) return 'warning'
    if (t.info >= 0 && durMs >= t.info) return 'info'

    const tt = config.traceTypeThresholds
    if (tt.error >= 0 && types >= tt.error) return 'error'
    if (tt.warning >= 0 && types >= tt.warning) return 'warning'
    if (tt.info >= 0 && types >= tt.info) return 'info'

    return undefined
  }

  private getPositionLabel(fileName: string, pos: number): string {
    const editor = vscode.window.visibleTextEditors.find(e => e.document.fileName === fileName)
    if (editor) {
      const position = editor.document.positionAt(pos + 1)
      return `L${position.line + 1}:C${position.character + 1}`
    }
    return `pos:${pos}`
  }

  getTreeItem(element: SidebarItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: SidebarItem): SidebarItem[] {
    if (!element) {
      // Root level: file summaries
      return this.summaries.map((summary) => {
        const iconPath = this.getSeverityIcon(summary.maxSeverity)
        const item = new SidebarItem(
          summary.relativePath,
          vscode.TreeItemCollapsibleState.Collapsed,
          `Total: ${Math.round(summary.totalCheckTime / 100) / 10}ms | ${summary.hotSpotCount} hot spots`,
          iconPath,
        )
        item.summary = summary
        return item
      })
    }

    // Child level: hot spots within a file
    if (element.summary) {
      return element.summary.hotSpots.map((hotSpot) => {
        const iconPath = this.getSeverityIcon(hotSpot.severity)
        const item = new SidebarItem(
          hotSpot.label,
          vscode.TreeItemCollapsibleState.None,
          hotSpot.description,
          iconPath,
        )
        item.hotSpot = hotSpot
        item.command = {
          command: 'tsperf.tracer.gotoTracePosition',
          title: 'Go to Position',
          arguments: [],
        }
        item.contextValue = 'hotSpot'
        return item
      })
    }

    return []
  }

  private getSeverityIcon(severity: HotSpotSeverity): vscode.ThemeIcon {
    switch (severity) {
      case 'error': return new vscode.ThemeIcon('error', new vscode.ThemeColor('errorForeground'))
      case 'warning': return new vscode.ThemeIcon('warning', new vscode.ThemeColor('editorWarning.foreground'))
      case 'info': return new vscode.ThemeIcon('info', new vscode.ThemeColor('editorInfo.foreground'))
    }
  }
}

export class SidebarItem extends vscode.TreeItem {
  summary?: FileSummary
  hotSpot?: HotSpot

  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    description?: string,
    iconPath?: vscode.ThemeIcon,
  ) {
    super(label, collapsibleState)
    if (description)
      this.description = description
    if (iconPath)
      this.iconPath = iconPath
  }
}

let sidebarProvider: SidebarProvider

export function initSidebar(ctx: vscode.ExtensionContext): void {
  sidebarProvider = new SidebarProvider()
  const treeView = vscode.window.createTreeView('tsperf-tracer-hotspots', {
    treeDataProvider: sidebarProvider,
    showCollapseAll: true,
  })
  ctx.subscriptions.push(treeView)
}

export function getSidebarProvider(): SidebarProvider {
  return sidebarProvider
}
