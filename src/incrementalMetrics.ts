import * as vscode from 'vscode'
import type { server } from 'typescript'
import { getCurrentConfig } from './configuration'
import { log } from './logger'

export interface MeasurementEntry {
  fileName: string
  line: number
  offset: number
  quickInfoDuration: number
  completionsDuration: number
  avgDuration: number
  typeName?: string
  timestamp: number
  documentVersion: number
}

interface FileMeasurements {
  version: number
  entries: MeasurementEntry[]
  totalDuration: number
  maxDuration: number
  lastUpdated: number
}

const measurementCache = new Map<string, FileMeasurements>()
let isEnabled = true

export function initIncrementalMetrics(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('tsperf.tracer.showMetrics', showMetricsPanel),
  )

  // Clear cache when document closes
  ctx.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((doc) => {
      measurementCache.delete(doc.fileName)
    }),
  )

  // Invalidate cache on document change
  ctx.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const entry = measurementCache.get(event.document.fileName)
      if (entry) {
        entry.version = -1 // Mark as stale
      }
    }),
  )
}

export function getFileMeasurements(fileName: string): FileMeasurements | undefined {
  return measurementCache.get(fileName)
}

export function getAllMeasurements(): Map<string, FileMeasurements> {
  return measurementCache
}

export function isCacheValid(fileName: string, version: number): boolean {
  const entry = measurementCache.get(fileName)
  return entry !== undefined && entry.version === version
}

export async function measurePosition(
  fileName: string,
  line: number,
  offset: number,
  documentVersion: number,
): Promise<MeasurementEntry | undefined> {
  if (!isEnabled)
    return undefined

  const config = getCurrentConfig()
  if (!config.enableRealtimeMetrics)
    return undefined

  try {
    const startQuick = performance.now()
    const quickInfoResult = await vscode.commands.executeCommand(
      'typescript.tsserverRequest',
      'quickinfo-full',
      { file: fileName, line, offset } satisfies server.protocol.FileLocationRequestArgs,
    ) as server.protocol.QuickInfoResponse
    const quickInfoDuration = performance.now() - startQuick

    const startComp = performance.now()
    await vscode.commands.executeCommand(
      'typescript.tsserverRequest',
      'completionInfo',
      { file: fileName, line, offset } satisfies server.protocol.CompletionsRequestArgs,
    ) as server.protocol.CompletionInfoResponse
    const completionsDuration = performance.now() - startComp

    const avgDuration = (quickInfoDuration + completionsDuration) / 2

    const entry: MeasurementEntry = {
      fileName,
      line,
      offset,
      quickInfoDuration,
      completionsDuration,
      avgDuration,
      typeName: quickInfoResult?.body?.displayString,
      timestamp: Date.now(),
      documentVersion,
    }

    updateCacheEntry(fileName, documentVersion, entry)
    return entry
  }
  catch (e) {
    log(`measurePosition failed: ${e}`)
    return undefined
  }
}

export async function measureFileIncremental(
  fileName: string,
  positions: Array<{ line: number, offset: number }>,
  documentVersion: number,
): Promise<MeasurementEntry[]> {
  if (!isEnabled)
    return []

  const config = getCurrentConfig()
  if (!config.enableRealtimeMetrics)
    return []

  // If cache is still valid, return cached results
  if (isCacheValid(fileName, documentVersion)) {
    return measurementCache.get(fileName)!.entries
  }

  const results: MeasurementEntry[] = []

  for (const pos of positions) {
    const entry = await measurePosition(fileName, pos.line, pos.offset, documentVersion)
    if (entry)
      results.push(entry)
  }

  return results
}

function updateCacheEntry(fileName: string, version: number, entry: MeasurementEntry): void {
  let fileEntry = measurementCache.get(fileName)
  if (!fileEntry || fileEntry.version !== version) {
    fileEntry = { version, entries: [], totalDuration: 0, maxDuration: 0, lastUpdated: Date.now() }
    measurementCache.set(fileName, fileEntry)
  }

  // Replace existing entry at same position or add new
  const existingIdx = fileEntry.entries.findIndex(
    e => e.line === entry.line && e.offset === entry.offset,
  )
  if (existingIdx >= 0)
    fileEntry.entries[existingIdx] = entry
  else
    fileEntry.entries.push(entry)

  fileEntry.totalDuration = fileEntry.entries.reduce((sum, e) => sum + e.avgDuration, 0)
  fileEntry.maxDuration = Math.max(...fileEntry.entries.map(e => e.avgDuration))
  fileEntry.lastUpdated = Date.now()
}

export function clearCache(fileName?: string): void {
  if (fileName)
    measurementCache.delete(fileName)
  else
    measurementCache.clear()
}

export function getTopHotSpots(count = 10): Array<{ fileName: string, entry: MeasurementEntry }> {
  const all: Array<{ fileName: string, entry: MeasurementEntry }> = []
  for (const [fileName, fileEntry] of measurementCache) {
    for (const entry of fileEntry.entries) {
      all.push({ fileName, entry })
    }
  }
  return all.sort((a, b) => b.entry.avgDuration - a.entry.avgDuration).slice(0, count)
}

async function showMetricsPanel(): Promise<void> {
  const hotSpots = getTopHotSpots(20)
  if (hotSpots.length === 0) {
    vscode.window.showInformationMessage('No metrics collected yet. Open a TypeScript file to start collecting.')
    return
  }

  const items = hotSpots.map(({ fileName, entry }) => ({
    label: `${
      entry.avgDuration > 200 ? '$(error)' : entry.avgDuration > 50 ? '$(warning)' : '$(check)'
    } ${entry.typeName || `L${entry.line}:C${entry.offset}`}`,
    description: `${Math.round(entry.avgDuration)}ms`,
    detail: `${fileName} - QuickInfo: ${Math.round(entry.quickInfoDuration)}ms, Completions: ${Math.round(entry.completionsDuration)}ms`,
    fileName,
    line: entry.line,
    offset: entry.offset,
  }))

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Top type complexity hot spots',
    title: 'TSPerf: Metrics Overview',
  })

  if (selected) {
    const doc = await vscode.workspace.openTextDocument(selected.fileName)
    const editor = await vscode.window.showTextDocument(doc)
    const position = new vscode.Position(selected.line - 1, selected.offset - 1)
    editor.selection = new vscode.Selection(position, position)
    editor.revealRange(new vscode.Range(position, position))
  }
}
