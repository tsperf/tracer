import { describe, expect, it } from 'vitest'
import { getIncrementalTraceWarning } from '../src/incrementalBuild'

describe('getIncrementalTraceWarning', () => {
  it('does not warn when incremental options are disabled', () => {
    expect(getIncrementalTraceWarning({})).toBeUndefined()
    expect(getIncrementalTraceWarning({ incremental: false, composite: false })).toBeUndefined()
  })

  it('warns when incremental builds are enabled', () => {
    const warning = getIncrementalTraceWarning({
      incremental: true,
      tsBuildInfoFile: '.cache/project.tsbuildinfo',
    })

    expect(warning).toContain('incremental')
    expect(warning).toContain('.cache/project.tsbuildinfo')
  })

  it('warns when composite builds imply incremental behavior', () => {
    const warning = getIncrementalTraceWarning({ composite: true })

    expect(warning).toContain('composite')
    expect(warning).toContain('.tsbuildinfo')
  })
})
