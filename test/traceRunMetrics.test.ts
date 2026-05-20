import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import {
  TRACE_RUN_METRICS_FILE,
  buildTraceRunMetrics,
  discoverTraceJsonFiles,
  summarizeOutput,
  summarizeTraceParse,
  writeTraceRunMetrics,
} from '../src/traceRunMetrics'

const tempDirs: string[] = []

async function makeTempDir() {
  const dir = await mkdtemp(join(tmpdir(), 'tsperf-trace-metrics-'))
  tempDirs.push(dir)
  return dir
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true })))
})

describe('trace run metrics', () => {
  it('summarizes output and keeps the tail when truncated', () => {
    expect(summarizeOutput('hello', 10)).toEqual({
      bytes: 5,
      truncated: false,
      text: 'hello',
    })

    expect(summarizeOutput('0123456789', 4)).toEqual({
      bytes: 10,
      truncated: true,
      text: '6789',
    })
  })

  it('discovers trace JSON files without including metrics.json', async () => {
    const traceDir = await makeTempDir()
    await writeFile(join(traceDir, 'types.json'), '[]')
    await writeFile(join(traceDir, 'trace.json'), '[]')
    await writeFile(join(traceDir, TRACE_RUN_METRICS_FILE), '{}')
    await writeFile(join(traceDir, 'notes.txt'), 'ignored')

    await expect(discoverTraceJsonFiles(traceDir)).resolves.toEqual([
      { fileName: 'trace.json', bytes: 2 },
      { fileName: 'types.json', bytes: 2 },
    ])
  })

  it('reports parse status for missing, valid, and invalid trace files', async () => {
    const traceDir = await makeTempDir()

    await expect(summarizeTraceParse(traceDir, [])).resolves.toEqual({
      status: 'missing',
      topLevelWarning: 'No trace JSON files were found.',
    })

    await writeFile(join(traceDir, 'trace.json'), '[]')
    const files = await discoverTraceJsonFiles(traceDir)
    await expect(summarizeTraceParse(traceDir, files)).resolves.toEqual({ status: 'ok' })

    await writeFile(join(traceDir, 'types.json'), '{')
    const invalidFiles = await discoverTraceJsonFiles(traceDir)
    const invalidSummary = await summarizeTraceParse(traceDir, invalidFiles)
    expect(invalidSummary.status).toBe('error')
    expect(invalidSummary.topLevelWarning).toContain('types.json:')
  })

  it('builds and writes a stable metrics artifact', async () => {
    const traceDir = await makeTempDir()
    const metrics = buildTraceRunMetrics({
      command: 'npx tsc --noEmit --generateTrace trace',
      cwd: '/repo',
      traceDir,
      startedAt: '2026-05-18T00:00:00.000Z',
      endedAt: '2026-05-18T00:00:01.250Z',
      wallTimeMs: 1250,
      exitCode: 0,
      stdout: 'ok',
      stderr: '',
      traceJsonFiles: [{ fileName: 'trace.json', bytes: 2 }],
      parseSummary: { status: 'ok' },
    })

    expect(metrics).toMatchObject({
      version: 1,
      command: 'npx tsc --noEmit --generateTrace trace',
      cwd: '/repo',
      traceDir,
      wallTimeMs: 1250,
      exitCode: 0,
      stdout: { bytes: 2, truncated: false, text: 'ok' },
      stderr: { bytes: 0, truncated: false, text: '' },
      traceJsonFiles: [{ fileName: 'trace.json', bytes: 2 }],
      parse: { status: 'ok' },
    })

    await writeTraceRunMetrics(traceDir, metrics)
    await expect(readFile(join(traceDir, TRACE_RUN_METRICS_FILE), 'utf8'))
      .resolves.toBe(`${JSON.stringify(metrics, null, 2)}\n`)
  })
})
