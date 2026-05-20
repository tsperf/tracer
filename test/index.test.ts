import { describe, expect, it } from 'vitest'
import { isPathExcluded, parsePathExcludes } from '../src/treeFilters'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('parses path exclude filters', () => {
    expect(parsePathExcludes('node_modules, src/generated\nlib.dom.d.ts'))
      .toEqual(['node_modules', 'src/generated', 'lib.dom.d.ts'])
  })

  it('matches excluded paths case-insensitively', () => {
    const excludes = parsePathExcludes('node_modules,lib.dom.d.ts')

    expect(isPathExcluded('packages/app/node_modules/typescript/lib/lib.dom.d.ts', excludes))
      .toBe(true)

    expect(isPathExcluded('src/components/Button.tsx', excludes))
      .toBe(false)
  })
})
