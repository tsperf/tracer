import { describe, expect, it } from 'vitest'
import { traceSaveNameForFile } from '../src/traceCommand'

describe('traceSaveNameForFile', () => {
  it('uses the workspace-relative file path without extension', () => {
    expect(traceSaveNameForFile('/repo', '/repo/src/features/example.ts')).toBe('src/features/example')
  })

  it('preserves files without extensions', () => {
    expect(traceSaveNameForFile('/repo', '/repo/tsconfig')).toBe('tsconfig')
  })
})
