import { getTraceFiles } from '../../src/storage'
import type { FileStat } from './messages'
import type { DataLine, TraceData, TypeLine } from './traceData'

export interface Tree { line: DataLine, children: Tree[], types: TypeLine[], childTypeCnt: number }
function getRoot(): Tree {
  return {
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
    types: [],
    childTypeCnt: 0,
  } as const
}

export function toTree(traceData: TraceData): Tree {
  const tree: Tree = { ...getRoot() }
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

      const childTotalTypeCnt = curr.childTypeCnt + curr.types.length
      curr = stack.pop()!
      curr.childTypeCnt += childTotalTypeCnt
      endTs = curr.line.ts + (curr.line.dur ?? 0)
    }

    if (!line.dur) {
      if ('id' in line)
        curr.types.push(line)
    }
    else {
      endTs = line.ts + (line.dur ?? 0)
      const child = { line, children: [], types: [], childTypeCnt: 0 }
      curr.children.push(child)
      stack.push(curr)
      curr = child
    }
  }

  tree.line.dur = maxDur
  return tree
}

let traceTree: Tree | undefined
export function processTraceFiles() {
  traceTree = toTree(Object.values(getTraceFiles()).flat(1))
}

export function filterTree(startsWith: string, sourceFileName: string, position: number, tree = traceTree): Tree[] {
  if (!tree)
    return []

  if (
    ('name' in tree.line && tree.line.name.startsWith(startsWith))
    && (!sourceFileName || ((tree.line.args?.path ?? '').endsWith(sourceFileName)))
    && (!(position > 0) || ((tree.line.args?.pos ?? 0) === position))
  )
    return [tree]

  return tree.children.map(child => filterTree(startsWith, sourceFileName, position, child)).flat()
}

export function getStatsFromTree(fileName: string) {
  const stats: FileStat[] = []
  function visit(node: Tree) {
    if ('name' in node.line) {
      const line = node.line
      if (
        line.dur
        && line.args?.path
        && line.args.path === fileName
        && line.args?.pos
        && line.args?.end
      ) {
        const types = node.types.length
        stats.push({
          dur: line.dur,
          pos: line.args.pos,
          end: line.args.end,
          types,
          totalTypes: types + node.childTypeCnt,
        })
      }
    }
    node.children.forEach(visit)
  }

  const fileNodes = filterTree('', fileName, 0)
  fileNodes.forEach(visit)

  return stats
}
