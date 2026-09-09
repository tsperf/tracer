import type { HotPathNode } from '../shared/src/messages'
import type { Tree } from './traceTree'

export function getHotPathFromTree(startNode: Tree | undefined): HotPathNode[] {
  if (!startNode)
    return []

  const nodes: HotPathNode[] = []
  const visited = new Set<number>()
  let current: Tree | undefined = startNode.line.ph === 'root' ? getLongestRunningChild(startNode) : startNode

  while (current && !visited.has(current.id)) {
    visited.add(current.id)
    nodes.push({
      id: current.id,
      name: current.line.name,
      dur: current.line.dur ?? 0,
      typeCnt: current.typeCnt,
      childTypeCnt: current.childTypeCnt,
      totalTypeCnt: current.typeCnt + current.childTypeCnt,
      childCnt: current.childCnt,
      path: current.line.args?.path,
      pos: current.line.args?.pos,
      end: current.line.args?.end,
    })
    current = getLongestRunningChild(current)
  }

  return nodes
}

function getLongestRunningChild(node: Tree) {
  let longest: Tree | undefined
  for (const child of node.children) {
    if (!longest || (child.line.dur ?? 0) > (longest.line.dur ?? 0))
      longest = child
  }
  return longest
}
