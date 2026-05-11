import { describe, expect, it } from 'vitest'
import { getHotPathFromTree } from '../src/hotPath'
import type { Tree } from '../src/traceTree'

function treeNode(id: number, name: string, dur: number, children: Tree[] = [], typeCnt = 0, childTypeCnt = 0): Tree {
  return {
    id,
    line: {
      cat: id === 0 ? 'root' : 'check',
      name,
      ph: id === 0 ? 'root' : 'X',
      pid: 1,
      tid: 1,
      ts: id,
      dur,
      args: {
        path: `src/${name}.ts`,
        pos: id * 10,
        end: id * 10 + 5,
      },
    },
    children,
    types: [],
    childCnt: children.length,
    childTypeCnt,
    typeCnt,
  }
}

describe('getHotPathFromTree', () => {
  it('follows the longest-running child recursively', () => {
    const shortChild = treeNode(1, 'shortChild', 50)
    const deeperShortChild = treeNode(3, 'deeperShortChild', 10)
    const deeperLongChild = treeNode(4, 'deeperLongChild', 500, [], 2, 7)
    const longChild = treeNode(2, 'longChild', 100, [deeperShortChild, deeperLongChild], 3, 9)
    const root = treeNode(0, 'root', Number.MAX_SAFE_INTEGER, [shortChild, longChild])

    const hotPath = getHotPathFromTree(root)

    expect(hotPath.map(node => node.id)).toEqual([2, 4])
    expect(hotPath[0]).toMatchObject({
      childCnt: 2,
      childTypeCnt: 9,
      dur: 100,
      name: 'longChild',
      path: 'src/longChild.ts',
      pos: 20,
      totalTypeCnt: 12,
      typeCnt: 3,
    })
    expect(hotPath[1]).toMatchObject({
      childCnt: 0,
      childTypeCnt: 7,
      dur: 500,
      name: 'deeperLongChild',
      totalTypeCnt: 9,
      typeCnt: 2,
    })
  })
})
