import { isAbsolute, relative } from 'node:path'
import type { TraceData, TraceLine, TypeLine } from '../shared/src/traceData'
import { isDepthLimitTraceName } from '../shared/src/traceEvents'
import { getWorkspacePath } from './storage'
import { postMessage } from './webview'
import { traceFiles } from './appState'
import { getFileStatsFromTraceNodes } from './traceStats'

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
    else if (line.dur !== undefined || isDepthLimitTraceName(line.name)) {
      const child = { id: ++id, line, children: [], types: [], childTypeCnt: 0, childCnt: 0, typeCnt: 0 }
      treeIndexes[id] = child
      curr.childCnt = curr.children.push(child)
      if (line.dur !== undefined) {
        endTs = line.ts + line.dur
        stack.push(curr)
        curr = child
      }
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
export function showTree(startsWith: string, sourceFileName: string, position: number | '', updateUi = true, tree = traceTree) {
  if (showTreeInterval) {
    clearInterval(showTreeInterval)
    showTreeInterval = undefined
  }

  const nodes = filterTree(startsWith, sourceFileName, position, tree)
  const skinnyNodes = nodes.map(x => ({ ...x, children: [], types: [] }))
  if (updateUi)
    postMessage({ message: 'filterTree', startsWith, sourceFileName, position })

  postMessage({ message: 'showTree', nodes: [], step: 'start' })

  let i = 0

  // this can be large enough to freeze the UI if sent at once
  showTreeInterval = setInterval(() => {
    if (!showTreeInterval)
      return

    postMessage({ message: 'showTree', nodes: skinnyNodes.slice(i, i + 10), step: 'add' })
    i += 10
    if (i >= skinnyNodes.length) {
      clearInterval(showTreeInterval)
      showTreeInterval = undefined
      postMessage({ message: 'showTree', nodes: [], step: 'done' })
    }
  }, 30)

  nodes.forEach(node => treeIdNodes.set(node.id, node))
  return nodes
}

export function getChildrenById(id: number) {
  const nodes = treeIdNodes.get(id)?.children ?? []
  const ret: typeof nodes = []
  nodes.forEach((node) => {
    treeIdNodes.set(node.id, node)
    ret.push({ ...node, children: [], types: [] })
  })
  return ret
}

export function getTypesById(id: number) {
  return treeIdNodes.get(id)?.types ?? []
}

export function getStatsFromTree(fileName: string) {
  const workspacePath = getWorkspacePath()
  return getStatsFromTreeForFile(fileName, workspacePath)
}

export function getStatsFromTreeForFile(fileName: string, workspacePath: string, tree = traceTree) {
  const fileNodes = filterTree('', relative(workspacePath, fileName), 0, tree)
  return getFileStatsFromTraceNodes(fileNodes, fileName, workspacePath)
}

export function getTreeAtIndex(idx: number) {
  return treeIndexes[idx]
}
