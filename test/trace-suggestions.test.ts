import { describe, expect, it } from 'vitest'
import { getTraceSuggestions } from '../src/traceSuggestions'
import type { Tree } from '../src/traceTree'

function makeNode(overrides: {
  id?: number
  name: string
  line?: Partial<Tree['line']>
  children?: Tree[]
  types?: Tree['types']
  childCnt?: number
  childTypeCnt?: number
  typeCnt?: number
}): Tree {
  return {
    id: overrides.id ?? 1,
    line: {
      pid: 1,
      tid: 1,
      ph: 'X',
      cat: overrides.line?.cat ?? 'checkTypes',
      ts: overrides.line?.ts ?? 0,
      name: overrides.name,
      dur: overrides.line?.dur,
      args: overrides.line?.args,
    },
    children: overrides.children ?? [],
    types: overrides.types ?? [],
    childCnt: overrides.childCnt ?? 0,
    childTypeCnt: overrides.childTypeCnt ?? 0,
    typeCnt: overrides.typeCnt ?? 0,
  }
}

describe('getTraceSuggestions', () => {
  it('suggests simplifying depth-limit traces', () => {
    const tree = makeNode({
      name: 'check_DepthLimit',
      line: {
        dur: 12_000,
        args: { path: 'src/foo.ts', pos: 9 },
      },
    })

    const suggestions = getTraceSuggestions(tree)

    expect(suggestions.some(suggestion => suggestion.kind === 'depth-limit')).toBe(true)
    expect(suggestions.some(suggestion => suggestion.fileName === 'src/foo.ts')).toBe(true)
  })

  it('suggests simplifying expensive structured type comparisons', () => {
    const tree = makeNode({
      name: 'structuredTypeRelatedTo',
      line: {
        dur: 20_000,
        args: { path: 'src/bar.ts', pos: 17 },
      },
      typeCnt: 12,
      childTypeCnt: 50,
    })

    const suggestions = getTraceSuggestions(tree)

    expect(suggestions.some(suggestion => suggestion.kind === 'expensive-relation')).toBe(true)
    expect(suggestions.some(suggestion => suggestion.title.includes('Expensive type relation check'))).toBe(true)
  })
})
