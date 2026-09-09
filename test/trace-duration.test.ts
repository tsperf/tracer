import { describe, expect, it } from 'vitest'
import { getTraceRootDuration } from '../src/traceDuration'

describe('getTraceRootDuration', () => {
  it('uses the end timestamp of a finite trace event', () => {
    expect(getTraceRootDuration(0, { dur: 5, ts: 10 })).toBe(15)
  })

  it('keeps the current duration for open-ended root events', () => {
    expect(getTraceRootDuration(22, { dur: Number.MAX_SAFE_INTEGER, ts: 10 })).toBe(22)
  })
})
