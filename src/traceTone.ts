import type { Tree } from './traceTree'

export type TraceLineTone = 'default' | 'slow' | 'type-heavy' | 'mixed'

const SLOW_TRACE_US = 50_000
const TYPE_HEAVY_COUNT = 100

export function getTraceLineTone(tree: Pick<Tree, 'line' | 'typeCnt' | 'childTypeCnt'>): TraceLineTone {
  const duration = tree.line.dur ?? 0
  const totalTypes = tree.typeCnt + tree.childTypeCnt
  const isSlow = duration >= SLOW_TRACE_US
  const isTypeHeavy = totalTypes >= TYPE_HEAVY_COUNT

  if (isSlow && isTypeHeavy)
    return 'mixed'
  if (isSlow)
    return 'slow'
  if (isTypeHeavy)
    return 'type-heavy'
  return 'default'
}

export function getTraceLineToneStyle(tone: TraceLineTone): Record<string, string> {
  return {
    '--trace-line-accent': traceLineToneColor(tone),
  }
}

function traceLineToneColor(tone: TraceLineTone) {
  switch (tone) {
    case 'mixed':
      return 'var(--vscode-charts-red, #f14c4c)'
    case 'slow':
      return 'var(--vscode-charts-orange, #d18616)'
    case 'type-heavy':
      return 'var(--vscode-charts-purple, #b180d7)'
    case 'default':
      return 'transparent'
  }
}
