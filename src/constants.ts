export const extPrefix = 'tsperf.tracer'

export const configKeys = [
  'typescriptPath',
  'typescriptPathMode',
  'benchmarkIterations',
  'restartTsserverOnIteration',
  'allIdentifiers',
  'traceCmd',
] as const

export type ConfigKey = typeof configKeys[number]
