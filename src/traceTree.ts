import { isAbsolute, join, relative } from 'node:path'
import type { FileStat } from '../shared/src/messages'
import type { TraceData, TraceLine, TypeLine } from '../shared/src/traceData'
import { getWorkspacePath } from './storage'
import { postMessage } from './webview'
import { traceFiles } from './appState'

export interface Tree { id: number, line: TraceLine, children: Tree[], types: TypeLine[], childCnt: number, childTypeCnt: number, typeCnt: number }
function getRoot(): Tree {
  return {
    id: 0,
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
    childCnt: 0,
    childTypeCnt: 0,
    typeCnt: 0,
  } as const
}

let treeIndexes: Tree[] = []
export function toTree(traceData: TraceData, workspacePath: string): Tree {
  const tree: Tree = { ...getRoot() }
  let endTs = Number.MAX_SAFE_INTEGER
  let curr = tree
  let maxDur = 0
  let id = 0

  const stack: Tree[] = []

  treeIndexes = [tree]

  const data = traceData.filter(x => 'id' in x || ('cat' in x)).sort((a, b) => a.ts - b.ts)
  // const data = traceData.filter(x => 'id' in x || ('cat' in x && x.cat?.startsWith('check'))).sort((a, b) => a.ts - b.ts)
  for (const line of data) {
    if ('args' in line && line.args?.path && isAbsolute(line.args?.path))
      line.args.path = relative(workspacePath, line.args.path)

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

    if ('id' in line) {
      curr.typeCnt = curr.types.push(line)
    }
    else if (line.dur) {
      endTs = line.ts + (line.dur ?? 0)
      const child = { id: ++id, line, children: [], types: [], childTypeCnt: 0, childCnt: 0, typeCnt: 0 }
      treeIndexes[id] = child
      curr.childCnt = curr.children.push(child)
      stack.push(curr)
      curr = child
    }
  }

  tree.line.dur = maxDur
  return tree
}

let traceTree: Tree | undefined
export async function processTraceFiles() {
  const workspacePath = await getWorkspacePath()
  traceTree = toTree(Object.values(traceFiles.value).flat(1), workspacePath)
}

export function filterTree(startsWith: string, sourceFileName: string, position: number | '', tree = traceTree): Tree[] {
  if (position === '')
    position = 0

  if (!tree)
    return []

  if (
    ('name' in tree.line && tree.line.name.startsWith(startsWith))
    && (!sourceFileName || ((tree.line.args?.path ?? '').endsWith(sourceFileName)))
    && (!(position > 0) || ((tree.line.args?.pos ?? 0) === position))
  ) {
    return [tree]
  }

  return tree.children.map(child => filterTree(startsWith, sourceFileName, position, child)).flat()
}

export const treeIdNodes = new Map<number, Tree>()
let showTreeInterval: undefined | ReturnType<typeof setInterval>
const childTreeIntervals = new Map<number, ReturnType<typeof setInterval>>()

const treeChunkSize = 10
const treeChunkIntervalMs = 30
const childTreeChunkSize = 10
const childTreeChunkIntervalMs = 30

function toSkinnyNode(node: Tree): Tree {
  return { ...node, children: [], types: [] }
}

function stopChildTreeInterval(id: number) {
  const interval = childTreeIntervals.get(id)
  if (!interval)
    return

  clearInterval(interval)
  childTreeIntervals.delete(id)
}

function stopChildTreeIntervals() {
  for (const id of childTreeIntervals.keys())
    stopChildTreeInterval(id)
}

export function showTree(startsWith: string, sourceFileName: string, position: number | '', updateUi = true, tree = traceTree) {
  if (showTreeInterval) {
    clearInterval(showTreeInterval)
    showTreeInterval = undefined
  }
  stopChildTreeIntervals()

  const nodes = filterTree(startsWith, sourceFileName, position, tree)
  const skinnyNodes = nodes.map(toSkinnyNode)
  if (updateUi)
    postMessage({ message: 'filterTree', startsWith, sourceFileName, position })

  postMessage({ message: 'showTree', nodes: [], step: 'start' })

  let i = 0

  // this can be large enough to freeze the UI if sent at once
  showTreeInterval = setInterval(() => {
    if (!showTreeInterval)
      return

    postMessage({ message: 'showTree', nodes: skinnyNodes.slice(i, i + treeChunkSize), step: 'add' })
    i += treeChunkSize
    if (i >= skinnyNodes.length) {
      clearInterval(showTreeInterval)
      showTreeInterval = undefined
      postMessage({ message: 'showTree', nodes: [], step: 'done' })
    }
  }, treeChunkIntervalMs)

  nodes.forEach(node => treeIdNodes.set(node.id, node))
  return nodes
}

export function getChildrenById(id: number) {
  const nodes = treeIdNodes.get(id)?.children ?? []
  const ret: typeof nodes = []
  nodes.forEach((node) => {
    treeIdNodes.set(node.id, node)
    ret.push(toSkinnyNode(node))
  })
  return ret
}

export function streamChildrenById(id: number) {
  if (childTreeIntervals.has(id))
    return

  const children = getChildrenById(id)
  if (children.length === 0) {
    postMessage({ message: 'childrenById', id, children: [] })
    return
  }

  let i = 0
  const sendNext = () => {
    postMessage({ message: 'childrenById', id, children: children.slice(i, i + childTreeChunkSize) })
    i += childTreeChunkSize

    if (i >= children.length)
      stopChildTreeInterval(id)
  }

  const interval = setInterval(sendNext, childTreeChunkIntervalMs)
  childTreeIntervals.set(id, interval)
  sendNext()
}

export function getTypesById(id: number) {
  return treeIdNodes.get(id)?.types ?? []
}

export function getStatsFromTree(fileName: string) {
  const workspacePath = getWorkspacePath()

  const stats: FileStat[] = []
  function visit(node: Tree) {
    if ('name' in node.line) {
      const line = node.line
      if (
        line.dur
        && line.args?.path
        && join(workspacePath, line.args.path) === fileName
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

  const fileNodes = filterTree('', relative(workspacePath, fileName), 0)
  fileNodes.forEach(visit)

  return stats
}

export function getTreeAtIndex(idx: number) {
  return treeIndexes[idx]
}
