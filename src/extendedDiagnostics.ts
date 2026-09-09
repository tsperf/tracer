export type ExtendedDiagnosticUnit = 'count' | 'kb' | 'ms'

export interface ExtendedDiagnosticMetric {
  value: number
  unit: ExtendedDiagnosticUnit
  raw: string
}

export interface ExtendedDiagnosticsSummary {
  files?: number
  lines?: {
    total?: number
    library?: number
    definitions?: number
    typescript?: number
    javascript?: number
    json?: number
    other?: number
  }
  identifiers?: number
  symbols?: number
  types?: number
  instantiations?: number
  memoryUsedKb?: number
  parseTimeMs?: number
  bindTimeMs?: number
  checkTimeMs?: number
  emitTimeMs?: number
  totalTimeMs?: number
  metrics: Record<string, ExtendedDiagnosticMetric>
}

const metricKeysByLabel = new Map<string, string>([
  ['files', 'files'],
  ['lines', 'lines'],
  ['lines of library', 'linesOfLibrary'],
  ['lines of definitions', 'linesOfDefinitions'],
  ['lines of typescript', 'linesOfTypeScript'],
  ['lines of javascript', 'linesOfJavaScript'],
  ['lines of json', 'linesOfJson'],
  ['lines of other', 'linesOfOther'],
  ['nodes', 'nodes'],
  ['identifiers', 'identifiers'],
  ['symbols', 'symbols'],
  ['types', 'types'],
  ['instantiations', 'instantiations'],
  ['memory used', 'memoryUsed'],
  ['assignability cache size', 'assignabilityCacheSize'],
  ['identity cache size', 'identityCacheSize'],
  ['subtype cache size', 'subtypeCacheSize'],
  ['strict subtype cache size', 'strictSubtypeCacheSize'],
  ['i/o read time', 'ioReadTime'],
  ['i/o write time', 'ioWriteTime'],
  ['parse time', 'parseTime'],
  ['resolvemodule time', 'resolveModuleTime'],
  ['resolvetypereference time', 'resolveTypeReferenceTime'],
  ['resolvelibrary time', 'resolveLibraryTime'],
  ['program time', 'programTime'],
  ['bind time', 'bindTime'],
  ['check time', 'checkTime'],
  ['transformtime time', 'transformTime'],
  ['commenttime time', 'commentTime'],
  ['printtime time', 'printTime'],
  ['emit time', 'emitTime'],
  ['total time', 'totalTime'],
])

const valuePattern = /^([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)\s*([a-z]+)?$/i

export function parseExtendedDiagnostics(text: string): ExtendedDiagnosticsSummary | undefined {
  const metrics: Record<string, ExtendedDiagnosticMetric> = {}

  for (const line of text.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1)
      continue

    const label = line.slice(0, separatorIndex).trim().toLowerCase()
    const key = metricKeysByLabel.get(label)
    if (!key)
      continue

    const metric = parseMetricValue(line.slice(separatorIndex + 1))
    if (!metric)
      continue

    metrics[key] = metric
  }

  if (Object.keys(metrics).length === 0)
    return undefined

  const summary: ExtendedDiagnosticsSummary = { metrics }
  setSummaryNumber(summary, 'files', metrics.files)
  setSummaryNumber(summary, 'identifiers', metrics.identifiers)
  setSummaryNumber(summary, 'symbols', metrics.symbols)
  setSummaryNumber(summary, 'types', metrics.types)
  setSummaryNumber(summary, 'instantiations', metrics.instantiations)
  setSummaryNumber(summary, 'memoryUsedKb', metrics.memoryUsed)
  setSummaryNumber(summary, 'parseTimeMs', metrics.parseTime)
  setSummaryNumber(summary, 'bindTimeMs', metrics.bindTime)
  setSummaryNumber(summary, 'checkTimeMs', metrics.checkTime)
  setSummaryNumber(summary, 'emitTimeMs', metrics.emitTime)
  setSummaryNumber(summary, 'totalTimeMs', metrics.totalTime)

  const lines = {
    total: metrics.lines?.value,
    library: metrics.linesOfLibrary?.value,
    definitions: metrics.linesOfDefinitions?.value,
    typescript: metrics.linesOfTypeScript?.value,
    javascript: metrics.linesOfJavaScript?.value,
    json: metrics.linesOfJson?.value,
    other: metrics.linesOfOther?.value,
  }
  if (Object.values(lines).some(value => value !== undefined))
    summary.lines = lines

  return summary
}

function parseMetricValue(rawValue: string): ExtendedDiagnosticMetric | undefined {
  const raw = rawValue.trim()
  const match = valuePattern.exec(raw)
  if (!match)
    return undefined

  const value = Number(match[1].replace(/,/g, ''))
  if (!Number.isFinite(value))
    return undefined

  const rawUnit = match[2]?.toLowerCase()
  if (rawUnit === 's') {
    return {
      value: normalizeNumber(value * 1000),
      unit: 'ms',
      raw,
    }
  }

  if (rawUnit === 'ms') {
    return {
      value: normalizeNumber(value),
      unit: 'ms',
      raw,
    }
  }

  if (rawUnit === 'k' || rawUnit === 'kb' || rawUnit === 'kib') {
    return {
      value: normalizeNumber(value),
      unit: 'kb',
      raw,
    }
  }

  if (rawUnit === 'm' || rawUnit === 'mb' || rawUnit === 'mib') {
    return {
      value: normalizeNumber(value * 1024),
      unit: 'kb',
      raw,
    }
  }

  return {
    value: normalizeNumber(value),
    unit: 'count',
    raw,
  }
}

function normalizeNumber(value: number) {
  return Number(value.toFixed(3))
}

function setSummaryNumber(
  summary: ExtendedDiagnosticsSummary,
  key: Exclude<keyof ExtendedDiagnosticsSummary, 'lines' | 'metrics'>,
  metric: ExtendedDiagnosticMetric | undefined,
) {
  if (metric)
    summary[key] = metric.value
}
