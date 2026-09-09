import { describe, expect, it } from 'vitest'
import { formatTraceDurationMs } from '../ui/src/traceDuration'

describe('formatTraceDurationMs', () => {
  it('formats microsecond trace durations as milliseconds', () => {
    expect(formatTraceDurationMs(1234)).toBe('1.234ms')
  })

  it('formats missing durations as zero', () => {
    expect(formatTraceDurationMs(undefined)).toBe('0ms')
  })
})
