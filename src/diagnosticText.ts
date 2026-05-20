export function formatRealtimeDiagnosticMessage(durationMs: number, comparisonPercentage: number) {
  const sign = comparisonPercentage > 1 ? '+' : ''
  return `Realtime tsserver: ${Math.round(durationMs)}ms (${sign}${comparisonPercentage}%)`
}

export function formatTraceDiagnosticMessage(durationUs: number, types: number, totalTypes: number) {
  const typeStr = types || totalTypes ? ` Types: ${types} / ${totalTypes}` : ''
  return `Trace check: ${Math.round(durationUs) / 1000}ms${typeStr}`
}

export function formatTraceRelativeDiagnosticMessage(durationUs: number, durationRelative: string, types: number, totalTypes: number, typesRelative: string, totalTypesRelative: string) {
  const typeStr = types || totalTypes ? ` Types: ${types} / ${totalTypes} ${typesRelative} / ${totalTypesRelative}` : ''
  return `Trace check: ${Math.round(durationUs) / 1000}ms ${durationRelative}${typeStr}`
}
