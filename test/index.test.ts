import { describe, expect, it } from 'vitest'
import { summarizeTraceHotspots } from '../src/traceAnalysis'
import type { Tree } from '../src/traceTree'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('summarizes slow trace hotspots in descending duration order', () => {
    const root = {
      id: 0,
      line: { cat: 'root', name: 'root', ph: 'root', pid: 1, tid: 1, ts: 0, dur: 11000 },
      childCnt: 2,
      childTypeCnt: 0,
      typeCnt: 0,
      types: [],
      children: [
        {
          id: 1,
          line: { cat: 'check', name: 'checkExpression', ph: 'X', pid: 1, tid: 1, ts: 0, dur: 1000, args: { path: 'src/a.ts', pos: 4, end: 9 } },
          childCnt: 0,
          childTypeCnt: 0,
          typeCnt: 2,
          types: [],
          children: [],
        },
        {
          id: 2,
          line: { cat: 'check', name: 'structuredTypeRelatedTo', ph: 'X', pid: 1, tid: 1, ts: 1000, dur: 10000, args: { path: 'src/b.ts', pos: 20, end: 30 } },
          childCnt: 0,
          childTypeCnt: 4,
          typeCnt: 1,
          types: [],
          children: [],
        },
      ],
    } satisfies Tree

    expect(summarizeTraceHotspots(root, 2)).toEqual([
      expect.objectContaining({
        id: 2,
        name: 'structuredTypeRelatedTo',
        path: 'src/b.ts',
        pos: 20,
        dur: 10000,
        totalTypeCnt: 5,
        suggestion: 'Inspect type relationships and generic constraints around this span.',
      }),
      expect.objectContaining({ id: 1, name: 'checkExpression', totalTypeCnt: 2 }),
    ])
  })
})
