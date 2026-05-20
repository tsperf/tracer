import { describe, expect, it } from 'vitest'
import { getIncrementalTraceReason } from '../src/incrementalTrace'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('warns when trace command runs with incremental builds enabled', () => {
    expect(getIncrementalTraceReason('npx tsc --noEmit --generateTrace traces', { incremental: true }))
      .toBe('incremental builds')

    expect(getIncrementalTraceReason('npx tsc --noEmit --generateTrace traces --composite', {}))
      .toBe('composite projects')

    expect(getIncrementalTraceReason('npx tsc -b --generateTrace traces', {}))
      .toBe('TypeScript build mode')
  })

  it('does not warn when command is not generating a trace or disables incremental explicitly', () => {
    expect(getIncrementalTraceReason('npx tsc --noEmit', { incremental: true }))
      .toBeUndefined()

    expect(getIncrementalTraceReason('npx tsc --generateTrace traces --incremental false', {}))
      .toBeUndefined()
  })
})
