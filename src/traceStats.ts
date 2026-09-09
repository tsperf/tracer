import { join } from 'node:path'
import type { FileStat } from '../shared/src/messages'
import type { TraceLine, TypeLine } from '../shared/src/traceData'
import { isDepthLimitTraceName } from '../shared/src/traceEvents'

export interface TraceStatsNode {
  line: TraceLine
  children: TraceStatsNode[]
  types: TypeLine[]
  childTypeCnt: number
}

export function getFileStatsFromTraceNodes(nodes: TraceStatsNode[], fileName: string, workspacePath: string): FileStat[] {
  const stats: FileStat[] = []
  nodes.forEach(node => collectStats(node, fileName, workspacePath, stats))
  return stats
}

function collectStats(node: TraceStatsNode, fileName: string, workspacePath: string, stats: FileStat[]): string[] {
  const depthLimitEvents = isDepthLimitTraceName(node.line.name) ? [node.line.name] : []
  for (const child of node.children) {
    for (const event of collectStats(child, fileName, workspacePath, stats)) {
      if (!depthLimitEvents.includes(event))
        depthLimitEvents.push(event)
    }
  }

  const line = node.line
  if (
    (line.dur !== undefined || depthLimitEvents.length > 0)
    && line.args?.path
    && join(workspacePath, line.args.path) === fileName
    && line.args.pos !== undefined
    && line.args.end !== undefined
  ) {
    const types = node.types.length
    stats.push({
      dur: line.dur ?? 0,
      pos: line.args.pos,
      end: line.args.end,
      types,
      totalTypes: types + node.childTypeCnt,
      depthLimitEvents: depthLimitEvents.length ? depthLimitEvents : undefined,
    })
  }

  return depthLimitEvents
}
