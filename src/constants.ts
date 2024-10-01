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
  'enableTraceMetrics',
  'enableRealtimeMetrics',
  'fileBrowserExecutable',
  'maxDiagnosticsPerFile',
] as const

export type ConfigKey = typeof configKeys[number]

export const commandIds = [
  'tsperf.tracer.gotoTracePosition',
  'tsperf.tracer.openInBrowser',
  'tsperf.tracer.runTrace',
  'tsperf.tracer.openTerminal',
  'tsperf.tracer.openTraceDirExternal',
] as const

export type CommandId = typeof commandIds[number]
