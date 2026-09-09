import { describe, expect, it } from 'vitest'
import type { FilterTreeNode } from '../src/treeFilters'
import { getVisibleChildren, hasVisibleChildBranch, isPathExcluded, parseFilterList } from '../src/treeFilters'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('parses multiline and comma separated filter lists', () => {
    expect(parseFilterList('node_modules, src/generated\nlib.dom.d.ts'))
      .toEqual(['node_modules', 'src/generated', 'lib.dom.d.ts'])
  })

  it('matches excluded paths case-insensitively', () => {
    const excludes = parseFilterList('node_modules,lib.dom.d.ts')

    expect(isPathExcluded('packages/app/node_modules/typescript/lib/lib.dom.d.ts', excludes))
      .toBe(true)
    expect(isPathExcluded('src/components/Button.tsx', excludes))
      .toBe(false)
  })

  it('keeps ancestors for child trace name matches', () => {
    const tree = {
      line: { name: 'checkSourceFile', args: { path: 'src/app.ts' } },
      children: [
        {
          line: { name: 'bindSourceFile', args: { path: 'src/app.ts' } },
          children: [
            { line: { name: 'checkExpression', args: { path: 'src/app.ts' } }, children: [] },
          ],
        },
      ],
    }

    expect(hasVisibleChildBranch(tree.children[0], 'check', [])).toBe(true)
  })

  it('filters visible children by trace name and excluded path', () => {
    const tree: FilterTreeNode = {
      line: { name: 'root' },
      children: [
        { line: { name: 'checkSourceFile', args: { path: 'src/app.ts' } }, children: [] },
        { line: { name: 'checkSourceFile', args: { path: 'node_modules/lib/index.d.ts' } }, children: [] },
        { line: { name: 'bindSourceFile', args: { path: 'src/other.ts' } }, children: [] },
      ],
    }

    expect(getVisibleChildren(tree, {
      childStartsWith: 'check',
      excludePathIncludes: 'node_modules',
    }).map(node => node.line.args?.path)).toEqual(['src/app.ts'])
  })
})
