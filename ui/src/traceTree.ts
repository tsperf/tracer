import type { DataLine, TraceData } from './traceData'

export interface Tree { line: DataLine & { typeCnt: number }, children: Tree[] }
const root: Tree = {
  line: {
    cat: 'root',
    name: 'root',
    ph: 'root',
    pid: 1,
    tid: 1,
    ts: 0,
    dur: Number.MAX_SAFE_INTEGER,
    typeCnt: 0,
  },
  children: [],
}

function leaf(line: DataLine): Tree {
  return { line: { ...line, typeCnt: 0 }, children: [] }
}

export function toTree(traceData: TraceData): Tree {
  const positionCounts: Record<string, Record<number, number>> = {}

  const tree: Tree = { ...root }
  let endTs = Number.MAX_SAFE_INTEGER
  let curr = tree
  let maxDur = 0
  const stack: Tree[] = []

  const data = traceData.filter(x => 'id' in x || ('cat' in x)).sort((a, b) => a.ts - b.ts) as (DataLine & { typeCnt: number })[]
  // const data = traceData.filter(x => 'id' in x || ('cat' in x && x.cat?.startsWith('check'))).sort((a, b) => a.ts - b.ts)
  for (const line of data) {
    line.typeCnt = 0
    if (line.dur !== Number.MAX_SAFE_INTEGER && (line.dur ?? 0) > maxDur)
      maxDur = line.ts

    while (line.ts > endTs) {
      if (stack.length === 0)
        throw new Error('tree stack empty')

      const childTypeCnt = curr.line.typeCnt

      if (curr.line.dur && 'args' in curr.line && curr.line.args?.path && curr.line.args.pos) {
        const path = curr.line.args.path
        positionCounts[path] ??= {}
        positionCounts[path][curr.line.args.pos + 1] = curr.line.typeCnt
      }

      curr = stack.pop()!
      curr.line.typeCnt += childTypeCnt
      endTs = curr.line.ts + (curr.line.dur ?? 0)
    }

    if (!line.dur) {
      if ('id' in line) {
        curr.line.typeCnt++
        curr.children.push(leaf(line))
      }
    }
    else {
      endTs = line.ts + (line.dur ?? 0)
      const child = { line, children: [] }
      curr.children.push(child)
      stack.push(curr)
      curr = child
    }
  }

  /* if we make the real time diagnostics more stable we can add an option to update them with trace measurements like so:
  useNuxtApp().$sendMessage({ message: 'postionTypeCounts', counts: positionCounts })
  */

  tree.line.dur = maxDur
  return tree
}

export function typesInNode(x: Tree): number {
  return x.children.filter(x => 'id' in x.line).length + x.children.map(typesInNode).reduce((a, b) => a + b, 0)
}
