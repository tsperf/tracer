import type { Tree } from './traceTree'

export type TreeSortBy = 'Timestamp' | 'Duration' | 'Types' | 'Total Types'
export const childNodePageSize = 200

const treeSortValue: Record<TreeSortBy, (tree: Tree) => number> = {
  'Timestamp': tree => tree.line.ts,
  'Duration': tree => -(tree.line.dur ?? 0),
  'Types': tree => -tree.typeCnt,
  'Total Types': tree => -(tree.childTypeCnt + tree.typeCnt),
}

export function sortTreeNodes(nodes: Tree[], sortBy: TreeSortBy = 'Timestamp') {
  const getSortValue = treeSortValue[sortBy]
  return nodes.toSorted((a, b) => getSortValue(a) - getSortValue(b))
}

export function pageTreeNodes(nodes: Tree[], offset = 0, limit = childNodePageSize) {
  const children = nodes.slice(offset, offset + limit)
  return {
    children,
    total: nodes.length,
    nextOffset: offset + children.length < nodes.length ? offset + children.length : undefined,
  }
}
