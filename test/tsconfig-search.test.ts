import { describe, expect, it } from 'vitest'
import { tsconfigExcludeGlob, tsconfigIncludeGlob } from '../src/tsconfigSearch'

describe('tsconfigSearch', () => {
  it('uses a clean node_modules exclude glob', () => {
    expect(tsconfigIncludeGlob).toBe('**/tsconfig.json')
    expect(tsconfigExcludeGlob).toBe('**/node_modules/**')
    expect(tsconfigExcludeGlob).not.toContain('\u200B')
  })
})
