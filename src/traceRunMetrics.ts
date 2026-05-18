import { Buffer } from 'node:buffer'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export const TRACE_RUN_METRICS_FILE = 'metrics.json'

const DEFAULT_OUTPUT_LIMIT = 16_000

export interface OutputSummary {
  bytes: number
  truncated: boolean
  text: string
}

export interface TraceJsonFile {
  fileName: string
  bytes: number
}

export type TraceParseStatus = 'missing' | 'ok' | 'warning' | 'error'

export interface TraceParseSummary {
  status: TraceParseStatus
  topLevelWarning?: string
}

export interface TraceRunMetricsInput {
  command: string
  cwd: string
  traceDir: string
  startedAt: string
  endedAt: string
  wallTimeMs: number
  exitCode: number | null
  stdout: string
  stderr: string
  traceJsonFiles: TraceJsonFile[]
  parseSummary: TraceParseSummary
}

export interface TraceRunMetrics {
  version: 1
  command: string
  cwd: string
  traceDir: string
  startedAt: string
  endedAt: string
  wallTimeMs: number
  exitCode: number | null
  stdout: OutputSummary
  stderr: OutputSummary
  traceJsonFiles: TraceJsonFile[]
  parse: TraceParseSummary
}

export function summarizeOutput(text: string, limit = DEFAULT_OUTPUT_LIMIT): OutputSummary {
  const bytes = Buffer.byteLength(text)
  if (text.length <= limit) {
    return { bytes, truncated: false, text }
  }

  return {
    bytes,
    truncated: true,
    text: text.slice(text.length - limit),
  }
}

export function buildTraceRunMetrics(input: TraceRunMetricsInput): TraceRunMetrics {
  return {
    version: 1,
    command: input.command,
    cwd: input.cwd,
    traceDir: input.traceDir,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    wallTimeMs: input.wallTimeMs,
    exitCode: input.exitCode,
    stdout: summarizeOutput(input.stdout),
    stderr: summarizeOutput(input.stderr),
    traceJsonFiles: input.traceJsonFiles,
    parse: input.parseSummary,
  }
}

export async function discoverTraceJsonFiles(traceDir: string): Promise<TraceJsonFile[]> {
  const entries = await readdir(traceDir, { withFileTypes: true })
  const files = await Promise.all(
    entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.json') && entry.name !== TRACE_RUN_METRICS_FILE)
      .map(async (entry) => {
        const fileStat = await stat(join(traceDir, entry.name))
        return {
          fileName: entry.name,
          bytes: fileStat.size,
        }
      }),
  )

  return files.sort((a, b) => a.fileName.localeCompare(b.fileName))
}

export async function summarizeTraceParse(traceDir: string, traceJsonFiles: TraceJsonFile[]): Promise<TraceParseSummary> {
  if (traceJsonFiles.length === 0) {
    return {
      status: 'missing',
      topLevelWarning: 'No trace JSON files were found.',
    }
  }

  for (const file of traceJsonFiles) {
    try {
      JSON.parse(await readFile(join(traceDir, file.fileName), 'utf8'))
    }
    catch (error) {
      return {
        status: 'error',
        topLevelWarning: `${file.fileName}: ${error instanceof Error ? error.message : `${error}`}`,
      }
    }
  }

  return { status: 'ok' }
}

export async function writeTraceRunMetrics(traceDir: string, metrics: TraceRunMetrics): Promise<void> {
  const fileName = join(traceDir, TRACE_RUN_METRICS_FILE)
  await mkdir(dirname(fileName), { recursive: true })
  await writeFile(fileName, `${JSON.stringify(metrics, null, 2)}\n`, 'utf8')
}
