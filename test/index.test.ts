import { describe, expect, it } from 'vitest'
import { formatMiniTraceReport } from '../src/miniTraceReport'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('formats selected expression mini trace measurements', () => {
    expect(formatMiniTraceReport({
      label: '"value"',
      samples: [
        { quickInfoDuration: 12.2, completionsDuration: 18.9 },
        { quickInfoDuration: 14.7, completionsDuration: 20.1 },
      ],
    })).toBe('Mini trace "value": quick info 13ms, completions 20ms (2 runs)')
  })
})
