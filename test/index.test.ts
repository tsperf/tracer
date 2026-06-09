import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { findTsconfig, getIncrementalBuildWarning, hasIncrementalBuildEnabled } from '../src/incrementalBuildWarning'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })
})

describe('incremental build warnings', () => {
  it('detects incremental and composite compiler options', () => {
    expect(hasIncrementalBuildEnabled({ incremental: true })).toBe(true)
    expect(hasIncrementalBuildEnabled({ composite: true })).toBe(true)
    expect(hasIncrementalBuildEnabled({ incremental: false, composite: false })).toBe(false)
  })

  it('finds the nearest tsconfig without walking past the workspace', () => {
    const workspace = mkdtempSync(join(tmpdir(), 'tracer-workspace-'))
    const project = join(workspace, 'packages', 'app')
    mkdirSync(project, { recursive: true })
    writeFileSync(join(workspace, 'tsconfig.json'), '{}')

    expect(findTsconfig(project, workspace)).toBe(join(workspace, 'tsconfig.json'))
  })

  it('warns when the active tsconfig has incremental builds enabled', () => {
    const workspace = mkdtempSync(join(tmpdir(), 'tracer-workspace-'))
    writeFileSync(join(workspace, 'tsconfig.json'), JSON.stringify({ compilerOptions: { incremental: true } }))

    expect(getIncrementalBuildWarning(ts, workspace, workspace)).toContain('incremental builds enabled')
  })

  it('does not warn when incremental builds are disabled', () => {
    const workspace = mkdtempSync(join(tmpdir(), 'tracer-workspace-'))
    writeFileSync(join(workspace, 'tsconfig.json'), JSON.stringify({ compilerOptions: { incremental: false } }))

    expect(getIncrementalBuildWarning(ts, workspace, workspace)).toBeUndefined()
  })
})
