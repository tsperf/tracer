import { describe, expect, it } from 'vitest'

import { findClosestTsconfig } from '../src/tsconfigSelection'

describe('findClosestTsconfig', () => {
  it('selects the nearest tsconfig that contains the target file', () => {
    expect(findClosestTsconfig(
      '/repo/packages/app/src/index.ts',
      [
        '/repo/tsconfig.json',
        '/repo/packages/app/tsconfig.json',
      ],
    )).toBe('/repo/packages/app/tsconfig.json')
  })

  it('does not select a sibling package tsconfig for a package without one', () => {
    expect(findClosestTsconfig(
      '/repo/packages/app-b/src/index.ts',
      [
        '/repo/tsconfig.json',
        '/repo/packages/app-a/tsconfig.json',
      ],
    )).toBe('/repo/tsconfig.json')
  })

  it('ignores node_modules tsconfig files', () => {
    expect(findClosestTsconfig(
      '/repo/packages/app/src/index.ts',
      [
        '/repo/packages/app/node_modules/some-package/tsconfig.json',
        '/repo/tsconfig.json',
      ],
    )).toBe('/repo/tsconfig.json')
  })

  it('handles Windows-style paths', () => {
    expect(findClosestTsconfig(
      'C:\\repo\\packages\\app\\src\\index.ts',
      [
        'C:\\repo\\tsconfig.json',
        'C:\\repo\\packages\\app\\tsconfig.json',
      ],
    )).toBe('C:\\repo\\packages\\app\\tsconfig.json')
  })
})
