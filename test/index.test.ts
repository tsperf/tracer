import { describe, expect, it } from 'vitest'
import type { TraceData, TraceLine } from '../shared/src/traceData'
import { createTypeLineIndex, getResultTypeForLine } from '../src/traceTypes'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('resolves result type ids from trace lines', () => {
    const traceLine: TraceLine = {
      pid: 1,
      tid: 1,
      ph: 'X',
      cat: 'check',
      ts: 1,
      name: 'checkExpression',
      dur: 10,
      args: { results: { typeId: 7 } },
    }
    const traceData: TraceData = [
      {
        id: 7,
        display: 'Promise<string>',
        ts: 2,
      },
      traceLine,
    ]
    const typeLineIndex = createTypeLineIndex(traceData)

    expect(getResultTypeForLine(traceLine, typeLineIndex)?.display).toBe('Promise<string>')
  })
})
