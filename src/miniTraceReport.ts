export interface MiniTraceSample {
  quickInfoDuration: number
  completionsDuration: number
}

export interface MiniTraceReportArgs {
  label: string
  samples: MiniTraceSample[]
}

function average(values: number[]) {
  const finite = values.filter(Number.isFinite)
  if (finite.length === 0)
    return Number.NaN

  return finite.reduce((sum, value) => sum + value, 0) / finite.length
}

function formatMs(value: number) {
  if (!Number.isFinite(value))
    return 'n/a'

  return `${Math.round(value)}ms`
}

export function formatMiniTraceReport({ label, samples }: MiniTraceReportArgs) {
  const quickInfoAverage = average(samples.map(sample => sample.quickInfoDuration))
  const completionsAverage = average(samples.map(sample => sample.completionsDuration))
  const runs = samples.length === 1 ? '1 run' : `${samples.length} runs`

  return `Mini trace ${label}: quick info ${formatMs(quickInfoAverage)}, completions ${formatMs(completionsAverage)} (${runs})`
}
