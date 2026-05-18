import { describe, expect, it } from 'vitest'
import { compareTraceRunMetrics } from '../src/traceRunComparison'
import type { TraceRunMetrics } from '../src/traceRunMetrics'

function makeMetrics(overrides: Partial<TraceRunMetrics> = {}): TraceRunMetrics {
  return {
    version: 1,
    command: 'npx tsc --noEmit --generateTrace trace',
    cwd: '/repo',
    traceDir: '/repo/trace',
    startedAt: '2026-05-18T00:00:00.000Z',
    endedAt: '2026-05-18T00:00:01.000Z',
    wallTimeMs: 1000,
    exitCode: 0,
    stdout: { bytes: 2, truncated: false, text: 'ok' },
    stderr: { bytes: 0, truncated: false, text: '' },
    traceJsonFiles: [{ fileName: 'trace.json', bytes: 2 }],
    parse: { status: 'ok' },
    ...overrides,
  }
}

describe('trace run comparison', () => {
  it('compares core metrics between two run artifacts', () => {
    const before = makeMetrics({
      wallTimeMs: 1200,
      exitCode: 0,
      stdout: { bytes: 12, truncated: false, text: 'before run' },
      stderr: { bytes: 0, truncated: false, text: '' },
      traceJsonFiles: [{ fileName: 'trace.json', bytes: 2 }],
      parse: { status: 'ok' },
    })
    const after = makeMetrics({
      wallTimeMs: 1575,
      exitCode: 2,
      stdout: { bytes: 24, truncated: true, text: 'candidate run tail' },
      stderr: { bytes: 19, truncated: false, text: 'type errors emitted' },
      traceJsonFiles: [
        { fileName: 'trace.json', bytes: 2 },
        { fileName: 'types.json', bytes: 3 },
        { fileName: 'symbols.json', bytes: 4 },
      ],
      parse: { status: 'error', topLevelWarning: 'trace.json: invalid JSON' },
    })

    expect(compareTraceRunMetrics(before, after)).toEqual({
      wallTimeMs: { before: 1200, after: 1575, delta: 375 },
      exitCode: { before: 0, after: 2, changed: true },
      traceFileCount: { before: 1, after: 3, delta: 2 },
      parseStatus: { before: 'ok', after: 'error', changed: true },
      stdout: {
        bytes: { before: 12, after: 24, delta: 12 },
        summaryLength: { before: 10, after: 18, delta: 8 },
        truncated: { before: false, after: true, changed: true },
      },
      stderr: {
        bytes: { before: 0, after: 19, delta: 19 },
        summaryLength: { before: 0, after: 19, delta: 19 },
        truncated: { before: false, after: false, changed: false },
      },
    })
  })

  it('reports negative deltas and unchanged nullable/status fields', () => {
    const before = makeMetrics({
      wallTimeMs: 1000,
      exitCode: null,
      stdout: { bytes: 100, truncated: true, text: 'long stdout tail' },
      stderr: { bytes: 40, truncated: false, text: 'warnings' },
      traceJsonFiles: [
        { fileName: 'trace.json', bytes: 2 },
        { fileName: 'types.json', bytes: 3 },
      ],
      parse: { status: 'warning', topLevelWarning: 'top-level trace event was not an array' },
    })
    const after = makeMetrics({
      wallTimeMs: 850,
      exitCode: null,
      stdout: { bytes: 20, truncated: false, text: 'short' },
      stderr: { bytes: 0, truncated: false, text: '' },
      traceJsonFiles: [],
      parse: { status: 'warning', topLevelWarning: 'top-level trace event was not an array' },
    })

    const comparison = compareTraceRunMetrics(before, after)

    expect(comparison.wallTimeMs).toEqual({ before: 1000, after: 850, delta: -150 })
    expect(comparison.exitCode).toEqual({ before: null, after: null, changed: false })
    expect(comparison.traceFileCount).toEqual({ before: 2, after: 0, delta: -2 })
    expect(comparison.parseStatus).toEqual({ before: 'warning', after: 'warning', changed: false })
    expect(comparison.stdout.summaryLength).toEqual({ before: 16, after: 5, delta: -11 })
    expect(comparison.stderr.summaryLength).toEqual({ before: 8, after: 0, delta: -8 })
  })
})
