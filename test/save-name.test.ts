import { describe, expect, it } from 'vitest'
import { DEFAULT_SAVE_NAME, normalizeSaveName } from '../src/saveName'

describe('normalizeSaveName', () => {
  it('uses default for empty, absolute, or parent-traversal names', () => {
    expect(normalizeSaveName('')).toBe(DEFAULT_SAVE_NAME)
    expect(normalizeSaveName('   ')).toBe(DEFAULT_SAVE_NAME)
    expect(normalizeSaveName('/tmp/trace')).toBe(DEFAULT_SAVE_NAME)
    expect(normalizeSaveName('C:\\trace')).toBe(DEFAULT_SAVE_NAME)
    expect(normalizeSaveName('../trace')).toBe(DEFAULT_SAVE_NAME)
    expect(normalizeSaveName('feature/../trace')).toBe(DEFAULT_SAVE_NAME)
  })

  it('allows nested relative save names', () => {
    expect(normalizeSaveName(' main ')).toBe('main')
    expect(normalizeSaveName('feature/perf-trace')).toBe('feature/perf-trace')
  })
})
