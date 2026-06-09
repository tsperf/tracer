import { describe, expect, it } from 'vitest'
import type { Tree } from '../src/traceTree'
import { pageTreeNodes, sortTreeNodes } from '../src/treeChildren'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })
})

function tree(id: number, dur: number, typeCnt: number, childTypeCnt: number): Tree {
  return {
    id,
    line: {
      cat: 'check',
      name: `node-${id}`,
      ph: 'X',
      pid: 1,
      tid: 1,
      ts: id,
      dur,
    },
    children: [],
    types: [],
    childCnt: 0,
    childTypeCnt,
    typeCnt,
  }
}

describe('child node paging', () => {
  it('sorts children on the extension side before paging', () => {
    const nodes = [
      tree(1, 10, 1, 0),
      tree(2, 30, 0, 0),
      tree(3, 20, 2, 5),
    ]

    expect(sortTreeNodes(nodes, 'Duration').map(node => node.id)).toEqual([2, 3, 1])
    expect(sortTreeNodes(nodes, 'Total Types').map(node => node.id)).toEqual([3, 1, 2])
  })

  it('caps child pages and returns the next offset', () => {
    const nodes = sortTreeNodes(
      Array.from({ length: 205 }, (_, index) => tree(index + 1, index + 1, 0, 0)),
      'Duration',
    )

    const firstPage = pageTreeNodes(nodes)

    expect(firstPage.children).toHaveLength(200)
    expect(firstPage.children[0].id).toBe(205)
    expect(firstPage.total).toBe(205)
    expect(firstPage.nextOffset).toBe(200)

    const secondPage = pageTreeNodes(nodes, firstPage.nextOffset)

    expect(secondPage.children).toHaveLength(5)
    expect(secondPage.nextOffset).toBeUndefined()
  })
})
