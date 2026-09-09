import { describe, expect, it } from 'vitest'
import { hasTracePosition } from '../ui/src/tracePosition'

describe('hasTracePosition', () => {
  it('accepts zero as a valid trace position', () => {
    expect(hasTracePosition('src/index.ts', 0)).toBe(true)
  })

  it('rejects missing paths and positions', () => {
    expect(hasTracePosition(undefined, 0)).toBe(false)
    expect(hasTracePosition('src/index.ts', undefined)).toBe(false)
  })
})
