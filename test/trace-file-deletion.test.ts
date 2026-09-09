import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { getTraceFilesToDelete } from '../src/traceFileDeletion'

const tempRoots: string[] = []

afterEach(() => {
  while (tempRoots.length) {
    const root = tempRoots.pop()
    if (root)
      rmSync(root, { recursive: true, force: true })
  }
})

describe('getTraceFilesToDelete', () => {
  it('returns absolute json files in the target directory', () => {
    const root = mkdtempSync(join(tmpdir(), 'tsperf-tracer-delete-'))
    tempRoots.push(root)

    const traceDir = join(root, 'traces')
    mkdirSync(traceDir, { recursive: true })

    const jsonFile = join(traceDir, 'trace.json')
    const txtFile = join(traceDir, 'notes.txt')
    const nestedDir = join(traceDir, 'nested')
    mkdirSync(nestedDir)
    const nestedJson = join(nestedDir, 'nested.json')

    writeFileSync(jsonFile, '{}')
    writeFileSync(txtFile, 'keep')
    writeFileSync(nestedJson, '{}')

    expect(getTraceFilesToDelete(traceDir, '*')).toEqual([jsonFile])
    expect(readFileSync(jsonFile, 'utf8')).toBe('{}')
    expect(readFileSync(txtFile, 'utf8')).toBe('keep')
    expect(readFileSync(nestedJson, 'utf8')).toBe('{}')
  })

  it('returns a single absolute json path for direct deletion', () => {
    const root = mkdtempSync(join(tmpdir(), 'tsperf-tracer-delete-one-'))
    tempRoots.push(root)

    const traceDir = join(root, 'traces')
    mkdirSync(traceDir, { recursive: true })
    const jsonFile = join(traceDir, 'trace.json')
    writeFileSync(jsonFile, '{}')

    expect(getTraceFilesToDelete(traceDir, 'trace.json')).toEqual([jsonFile])
  })
})
