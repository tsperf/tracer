import type { OutputSummary, TraceParseStatus, TraceRunMetrics } from './traceRunMetrics'

export interface NumberDelta {
  before: number
  after: number
  delta: number
}

export interface NullableNumberChange {
  before: number | null
  after: number | null
  changed: boolean
}

export interface BooleanChange {
  before: boolean
  after: boolean
  changed: boolean
}

export interface StringChange<T extends string> {
  before: T
  after: T
  changed: boolean
}

export interface OutputSummaryComparison {
  bytes: NumberDelta
  summaryLength: NumberDelta
  truncated: BooleanChange
}

export interface TraceRunMetricsComparison {
  wallTimeMs: NumberDelta
  exitCode: NullableNumberChange
  traceFileCount: NumberDelta
  parseStatus: StringChange<TraceParseStatus>
  stdout: OutputSummaryComparison
  stderr: OutputSummaryComparison
}

function compareNumbers(before: number, after: number): NumberDelta {
  return {
    before,
    after,
    delta: after - before,
  }
}

function compareNullableNumbers(before: number | null, after: number | null): NullableNumberChange {
  return {
    before,
    after,
    changed: before !== after,
  }
}

function compareBooleans(before: boolean, after: boolean): BooleanChange {
  return {
    before,
    after,
    changed: before !== after,
  }
}

function compareStrings<T extends string>(before: T, after: T): StringChange<T> {
  return {
    before,
    after,
    changed: before !== after,
  }
}

function compareOutputSummary(before: OutputSummary, after: OutputSummary): OutputSummaryComparison {
  return {
    bytes: compareNumbers(before.bytes, after.bytes),
    summaryLength: compareNumbers(before.text.length, after.text.length),
    truncated: compareBooleans(before.truncated, after.truncated),
  }
}

export function compareTraceRunMetrics(before: TraceRunMetrics, after: TraceRunMetrics): TraceRunMetricsComparison {
  return {
    wallTimeMs: compareNumbers(before.wallTimeMs, after.wallTimeMs),
    exitCode: compareNullableNumbers(before.exitCode, after.exitCode),
    traceFileCount: compareNumbers(before.traceJsonFiles.length, after.traceJsonFiles.length),
    parseStatus: compareStrings(before.parse.status, after.parse.status),
    stdout: compareOutputSummary(before.stdout, after.stdout),
    stderr: compareOutputSummary(before.stderr, after.stderr),
  }
}
