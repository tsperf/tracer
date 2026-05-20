import type { Tree } from './traceTree'

export interface TraceInsight {
  id: number
  name: string
  path?: string
  pos?: number
  end?: number
  dur: number
  selfDur: number
  typeCnt: number
  totalTypeCnt: number
  reason: string
  suggestion: string
}

function ownDuration(node: Tree): number {
  const dur = node.line.dur ?? 0
  const childDur = node.children.reduce((sum, child) => sum + (child.line.dur ?? 0), 0)
  return Math.max(0, dur - childDur)
}

function reasonFor(node: Tree, selfDur: number): string {
  const dur = node.line.dur ?? 0
  const totalTypeCnt = node.typeCnt + node.childTypeCnt
  const reasons = []

  if (dur > 0)
    reasons.push(`${Math.round(dur / 1000)}ms total`)
  if (selfDur > 0)
    reasons.push(`${Math.round(selfDur / 1000)}ms self`)
  if (totalTypeCnt > 0)
    reasons.push(`${totalTypeCnt} types`)

  return reasons.join(', ')
}

function suggestionFor(node: Tree): string {
  const name = node.line.name.toLowerCase()
  const totalTypeCnt = node.typeCnt + node.childTypeCnt

  if (name.includes('related') || name.includes('relation'))
    return 'Inspect type relationships and generic constraints around this span.'
  if (name.includes('instantiate') || name.includes('infer'))
    return 'Look for repeated generic instantiation or inference at this span.'
  if (totalTypeCnt > 0)
    return 'Open the type table for this node and check the largest generated types.'

  return 'Open this span and compare the trace subtree before changing code.'
}

export function summarizeTraceHotspots(root: Tree | undefined, limit = 8): TraceInsight[] {
  if (!root)
    return []

  const insights: TraceInsight[] = []

  function visit(node: Tree) {
    if (node.id !== 0 && 'name' in node.line) {
      const selfDur = ownDuration(node)
      const totalTypeCnt = node.typeCnt + node.childTypeCnt
      const dur = node.line.dur ?? 0

      if (dur > 0 || totalTypeCnt > 0) {
        insights.push({
          id: node.id,
          name: node.line.name,
          path: node.line.args?.path,
          pos: node.line.args?.pos,
          end: node.line.args?.end,
          dur,
          selfDur,
          typeCnt: node.typeCnt,
          totalTypeCnt,
          reason: reasonFor(node, selfDur),
          suggestion: suggestionFor(node),
        })
      }
    }

    node.children.forEach(visit)
  }

  visit(root)

  return insights
    .sort((a, b) => {
      const byDuration = b.dur - a.dur
      if (byDuration !== 0)
        return byDuration
      return b.totalTypeCnt - a.totalTypeCnt
    })
    .slice(0, limit)
}
