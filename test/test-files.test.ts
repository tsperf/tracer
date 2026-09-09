import { describe, expect, it } from 'vitest'
import { getTestFileNames } from '../src/testFiles'

describe('getTestFileNames', () => {
  it('includes TypeScript source module extensions', () => {
    expect(getTestFileNames([
      'src/a.ts',
      'src/b.tsx',
      'src/c.mts',
      'src/d.cts',
    ])).toEqual([
      'src/a.ts',
      'src/b.tsx',
      'src/c.mts',
      'src/d.cts',
    ])
  })

  it('excludes declaration files and non-TypeScript files', () => {
    expect(getTestFileNames([
      'src/a.d.ts',
      'src/b.d.mts',
      'src/c.d.cts',
      'src/d.js',
    ])).toEqual([])
  })
})
