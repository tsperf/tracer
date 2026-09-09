import { describe, expect, it } from 'vitest'
import { fileStat } from '../shared/src/messages'
import { traceData } from '../shared/src/traceData'
import { getDepthLimitTraceNames, isDepthLimitTraceName } from '../shared/src/traceEvents'
import { getFileStatsFromTraceNodes } from '../src/traceStats'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })
})

describe('depth limit traces', () => {
  it('detects depth limit trace event names', () => {
    expect(isDepthLimitTraceName('instantiateType_DepthLimit')).toBe(true)
    expect(isDepthLimitTraceName('structuredTypeRelatedTo')).toBe(false)
  })

  it('accepts depth limit trace metadata', () => {
    expect(traceData.safeParse([
      {
        pid: 1,
        tid: 1,
        ph: 'I',
        cat: 'checkTypes',
        ts: 5,
        name: 'instantiateType_DepthLimit',
        args: { typeId: 1, instantiationDepth: 100, instantiationCount: 5000000 },
      },
    ]).success).toBe(true)
    expect(fileStat.safeParse({
      dur: 10,
      pos: 4,
      end: 12,
      types: 0,
      totalTypes: 0,
      depthLimitEvents: ['instantiateType_DepthLimit'],
    }).success).toBe(true)
  })

  it('collects depth limit trace names from a trace tree', () => {
    expect(getDepthLimitTraceNames({
      line: { name: 'checkExpression' },
      children: [
        { line: { name: 'instantiateType_DepthLimit' }, children: [] },
        { line: { name: 'instantiateType_DepthLimit' }, children: [] },
        { line: { name: 'structuredTypeRelatedTo' }, children: [] },
      ],
    })).toEqual(['instantiateType_DepthLimit'])
    expect(getDepthLimitTraceNames({
      line: { name: 'checkExpression' },
      children: [
        { line: { name: 'instantiateType_DepthLimit' }, children: [] },
        { line: { name: 'varianceCheck_DepthLimit' }, children: [] },
      ],
    })).toEqual([
      'instantiateType_DepthLimit',
      'varianceCheck_DepthLimit',
    ])
  })

  it('adds depth limit events to file stats in a single traversal', () => {
    const stats = getFileStatsFromTraceNodes([
      {
        line: {
          pid: 1,
          tid: 1,
          ph: 'X',
          cat: 'check',
          ts: 0,
          name: 'checkExpression',
          dur: 10,
          args: { path: 'src/example.ts', pos: 0, end: 12 },
        },
        children: [
          {
            line: {
              pid: 1,
              tid: 1,
              ph: 'I',
              cat: 'checkTypes',
              ts: 5,
              name: 'instantiateType_DepthLimit',
              args: { typeId: 1, instantiationDepth: 100, instantiationCount: 5000000 },
            },
            children: [],
            types: [],
            childTypeCnt: 0,
          },
        ],
        types: [],
        childTypeCnt: 0,
      },
    ], '/repo/src/example.ts', '/repo')

    expect(stats).toEqual([
      {
        dur: 10,
        pos: 0,
        end: 12,
        types: 0,
        totalTypes: 0,
        depthLimitEvents: ['instantiateType_DepthLimit'],
      },
    ])
  })
})
