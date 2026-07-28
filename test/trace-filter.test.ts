import { describe, expect, it } from 'vitest'
import { matchesTracePositionFilter } from '../src/traceFilter'

describe('matchesTracePositionFilter', () => {
  it('treats an empty position as no filter', () => {
    expect(matchesTracePositionFilter(undefined, '')).toBe(true)
    expect(matchesTracePositionFilter(12, '')).toBe(true)
    expect(matchesTracePositionFilter(0, '')).toBe(true)
  })

  it('matches numeric positions exactly, including zero', () => {
    expect(matchesTracePositionFilter(0, 0)).toBe(true)
    expect(matchesTracePositionFilter(12, 12)).toBe(true)
    expect(matchesTracePositionFilter(12, 0)).toBe(false)
    expect(matchesTracePositionFilter(undefined, 0)).toBe(false)
  })
})
