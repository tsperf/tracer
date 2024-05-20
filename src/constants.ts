export const extPrefix = 'tsperf.tracer'

export const configKeys = [
  'typescriptPath',
  'typescriptPathMode',
  'benchmarkIterations',
  'restartTsserverOnIteration',
  'allIdentifiers',
  'traceCmd',
  'traceTimeThresholds',
  'traceTypeThresholds',
  'traceTotalTypeThresholds',
  'traceDiagnosticsRelative',
  'traceTimeRelativeThresholds',
  'traceTypeRelativeThresholds',
  'traceTotalTypeRelativeThresholds',
] as const

export type ConfigKey = typeof configKeys[number]
