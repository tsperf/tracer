import type { FileStat } from '../shared/src/messages'

type TraceDiagnosticStats = Pick<FileStat, 'dur' | 'types' | 'totalTypes'>

function relativeString(value: number) {
  return `(${value > 0 ? '+' : ''}${Math.round(10000 * value) / 100}%)`
}

export function formatTraceDiagnosticMessage({ dur, types, totalTypes }: TraceDiagnosticStats) {
  const typeStr = types || totalTypes ? ` Types: ${types} / ${totalTypes}` : ''
  return `Trace check ms: ${Math.round(dur) / 1000} ${typeStr}`.trim()
}

export function formatRelativeTraceDiagnosticMessage({ dur, types, totalTypes }: TraceDiagnosticStats, averages: { dur: number, types: number, totalTypes: number }) {
  const relative = {
    dur: dur / (averages.dur || 1),
    types: types / (averages.types || 1),
    totalTypes: totalTypes / (averages.totalTypes || 1),
  }

  const typeStr = types || totalTypes
    ? ` Types: ${types} / ${totalTypes} ${relativeString(relative.types)} / ${relativeString(relative.totalTypes)}`
    : ''

  return `Trace check ms: ${Math.round(dur) / 1000} ${relativeString(relative.dur)} ${typeStr}`.trim()
}
