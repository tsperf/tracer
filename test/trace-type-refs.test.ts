import { describe, expect, it } from 'vitest'
import { getTraceLineTypeRefs, typeLine } from '../shared/src/traceData'

describe('getTraceLineTypeRefs', () => {
  it('resolves mapped id fields and nested result type ids', () => {
    const source = typeLine.parse({
      id: 38,
      ts: 1,
      display: 'SourceType',
    })
    const target = typeLine.parse({
      id: 229,
      ts: 2,
      intrinsicName: 'TargetType',
    })

    const refs = getTraceLineTypeRefs(
      {
        pid: 1,
        tid: 1,
        ph: 'X',
        cat: 'checkTypes',
        ts: 1,
        name: 'structuredTypeRelatedTo',
        dur: 10,
        args: {
          sourceId: 38,
          targetId: 229,
          results: {
            typeId: 38,
          },
        },
      },
      new Map([[38, source], [229, target]]),
    )

    expect(refs.map(ref => ref.key)).toEqual(['sourceId', 'targetId', 'results.typeId'])
    expect(refs[0].label).toBe('SourceType')
    expect(refs[1].label).toBe('TargetType')
    expect(refs[2].typeId).toBe(38)
    expect(refs[2].title).toContain('SourceType')
  })
})
