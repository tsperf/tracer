import { describe, expect, it } from 'vitest'
import { getTraceDataSummary, traceData } from '../shared/src/traceData'

describe('traceData', () => {
  it('parses trace events', () => {
    const result = traceData.safeParse([
      {
        pid: 1,
        tid: 1,
        ph: 'X',
        cat: 'check',
        ts: 10,
        name: 'checkSourceFile',
        dur: 20,
        args: { path: '/workspace/src/index.ts', pos: 1, end: 2 },
      },
    ])

    expect(result.success).toBe(true)
  })

  it('parses timestamped types', () => {
    const result = traceData.safeParse([
      {
        id: 1,
        intrinsicName: 'string',
        recursionId: 1,
        flags: ['String'],
        ts: 12,
        dur: 1,
        display: 'string',
      },
    ])

    expect(result.success).toBe(true)
    expect(result.success && getTraceDataSummary(result.data)).toEqual({
      totalTypes: 1,
      timestampedTypes: 1,
      untimestampedTypes: 0,
      parseWarning: undefined,
    })
  })

  it('parses untimestamped stock TypeScript types', () => {
    const result = traceData.safeParse([
      {
        id: 1,
        intrinsicName: 'string',
        recursionId: 1,
        flags: ['String'],
        display: 'string',
      },
      {
        id: 2,
        recursionId: 2,
        flags: ['Object'],
        display: '{ value: string }',
      },
    ])

    expect(result.success).toBe(true)
    expect(result.success && getTraceDataSummary(result.data)).toEqual({
      totalTypes: 2,
      timestampedTypes: 0,
      untimestampedTypes: 2,
      parseWarning: '2 type entries are missing timestamps and cannot be attributed to trace spans.',
    })
  })
})
