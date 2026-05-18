import { readFile } from 'node:fs/promises'
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

export interface OptionalNumberDelta {
  before: number | undefined
  after: number | undefined
  delta: number | undefined
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

export interface ExtendedDiagnosticsComparison {
  types: OptionalNumberDelta
  instantiations: OptionalNumberDelta
  memoryUsedKb: OptionalNumberDelta
  parseTimeMs: OptionalNumberDelta
  bindTimeMs: OptionalNumberDelta
  checkTimeMs: OptionalNumberDelta
  emitTimeMs: OptionalNumberDelta
  totalTimeMs: OptionalNumberDelta
}

export interface TraceRunMetricsComparison {
  wallTimeMs: NumberDelta
  exitCode: NullableNumberChange
  traceFileCount: NumberDelta
  parseStatus: StringChange<TraceParseStatus>
  extendedDiagnostics: ExtendedDiagnosticsComparison
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

function compareOptionalNumbers(before: number | undefined, after: number | undefined): OptionalNumberDelta {
  return {
    before,
    after,
    delta: before === undefined || after === undefined ? undefined : after - before,
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

function compareExtendedDiagnostics(before: TraceRunMetrics, after: TraceRunMetrics): ExtendedDiagnosticsComparison {
  return {
    types: compareOptionalNumbers(before.extendedDiagnostics?.types, after.extendedDiagnostics?.types),
    instantiations: compareOptionalNumbers(before.extendedDiagnostics?.instantiations, after.extendedDiagnostics?.instantiations),
    memoryUsedKb: compareOptionalNumbers(before.extendedDiagnostics?.memoryUsedKb, after.extendedDiagnostics?.memoryUsedKb),
    parseTimeMs: compareOptionalNumbers(before.extendedDiagnostics?.parseTimeMs, after.extendedDiagnostics?.parseTimeMs),
    bindTimeMs: compareOptionalNumbers(before.extendedDiagnostics?.bindTimeMs, after.extendedDiagnostics?.bindTimeMs),
    checkTimeMs: compareOptionalNumbers(before.extendedDiagnostics?.checkTimeMs, after.extendedDiagnostics?.checkTimeMs),
    emitTimeMs: compareOptionalNumbers(before.extendedDiagnostics?.emitTimeMs, after.extendedDiagnostics?.emitTimeMs),
    totalTimeMs: compareOptionalNumbers(before.extendedDiagnostics?.totalTimeMs, after.extendedDiagnostics?.totalTimeMs),
  }
}

export function compareTraceRunMetrics(before: TraceRunMetrics, after: TraceRunMetrics): TraceRunMetricsComparison {
  return {
    wallTimeMs: compareNumbers(before.wallTimeMs, after.wallTimeMs),
    exitCode: compareNullableNumbers(before.exitCode, after.exitCode),
    traceFileCount: compareNumbers(before.traceJsonFiles.length, after.traceJsonFiles.length),
    parseStatus: compareStrings(before.parse.status, after.parse.status),
    extendedDiagnostics: compareExtendedDiagnostics(before, after),
    stdout: compareOutputSummary(before.stdout, after.stdout),
    stderr: compareOutputSummary(before.stderr, after.stderr),
  }
}

export async function readTraceRunMetricsFile(fileName: string): Promise<TraceRunMetrics> {
  return JSON.parse(await readFile(fileName, 'utf8')) as TraceRunMetrics
}

function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined ? '-' : `${value}`
}

function formatDelta(value: number | undefined): string {
  if (value === undefined)
    return '-'

  return value > 0 ? `+${value}` : `${value}`
}

function metricRow(name: string, comparison: NumberDelta | OptionalNumberDelta): string {
  return `| ${name} | ${formatNumber(comparison.before)} | ${formatNumber(comparison.after)} | ${formatDelta(comparison.delta)} |`
}

export function formatTraceRunMetricsComparison(comparison: TraceRunMetricsComparison): string {
  const rows = [
    metricRow('Wall time ms', comparison.wallTimeMs),
    metricRow('Trace JSON files', comparison.traceFileCount),
    metricRow('Types', comparison.extendedDiagnostics.types),
    metricRow('Instantiations', comparison.extendedDiagnostics.instantiations),
    metricRow('Memory used KB', comparison.extendedDiagnostics.memoryUsedKb),
    metricRow('Parse time ms', comparison.extendedDiagnostics.parseTimeMs),
    metricRow('Bind time ms', comparison.extendedDiagnostics.bindTimeMs),
    metricRow('Check time ms', comparison.extendedDiagnostics.checkTimeMs),
    metricRow('Emit time ms', comparison.extendedDiagnostics.emitTimeMs),
    metricRow('Total time ms', comparison.extendedDiagnostics.totalTimeMs),
  ]

  return [
    '# Trace Metrics Comparison',
    '',
    `Exit code: ${formatNumber(comparison.exitCode.before)} -> ${formatNumber(comparison.exitCode.after)}${comparison.exitCode.changed ? ' (changed)' : ''}`,
    `Parse status: ${comparison.parseStatus.before} -> ${comparison.parseStatus.after}${comparison.parseStatus.changed ? ' (changed)' : ''}`,
    '',
    '| Metric | Before | After | Delta |',
    '| --- | ---: | ---: | ---: |',
    ...rows,
    '',
  ].join('\n')
}
