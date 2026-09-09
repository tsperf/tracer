import { describe, expect, it } from 'vitest'
import { toTsserverLocation } from '../src/tsserverLocation'

describe('toTsserverLocation', () => {
  it('converts TypeScript zero-based positions to tsserver one-based positions', () => {
    expect(toTsserverLocation(0, 0)).toEqual({ line: 1, offset: 1 })
    expect(toTsserverLocation(4, 8)).toEqual({ line: 5, offset: 9 })
  })
})
