import type { TraceLine } from './traceData'

export interface Tree {
  id: number
  parentId: number
  line: TraceLine
  children: Tree[]
  typeIds: number[]
  childCnt: number
  maxDepth: number
  childTypeCnt: number
  typeCnt: number
}
