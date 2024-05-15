import type { DataLine, TraceData } from './traceData'

export interface Tree { line: DataLine, children: Tree[] }
const root: Tree = {
  line: {
    cat: 'root',
    name: 'root',
    ph: 'root',
    pid: 1,
    tid: 1,
    ts: 0,
    dur: Number.MAX_SAFE_INTEGER,
  },
  children: [],
}

function leaf(line: DataLine): Tree {
  return { line, children: [] }
}

export function toTree(traceData: TraceData): Tree {
  const tree: Tree = { ...root }
  let endTs = Number.MAX_SAFE_INTEGER
  let curr = tree
  let maxDur = 0
  const stack: Tree[] = []

  const data = traceData.filter(x => 'id' in x || ('cat' in x)).sort((a, b) => a.ts - b.ts)
  // const data = traceData.filter(x => 'id' in x || ('cat' in x && x.cat?.startsWith('check'))).sort((a, b) => a.ts - b.ts)
  for (const line of data) {
    if (line.dur !== Number.MAX_SAFE_INTEGER && (line.dur ?? 0) > maxDur)
      maxDur = line.ts

    while (line.ts > endTs) {
      if (stack.length === 0)
        throw new Error('tree stack empty')
      curr = stack.pop()!
      endTs = curr.line.ts + (curr.line.dur ?? 0)
    }

    if (!line.dur) {
      if ('id' in line)
        curr.children.push(leaf(line))
    }
    else {
      endTs = line.ts + (line.dur ?? 0)
      const child = { line, children: [] }
      curr.children.push(child)
      stack.push(curr)
      curr = child
    }
  }

  tree.line.dur = maxDur
  return tree
}
