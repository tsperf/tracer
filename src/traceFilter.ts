export function matchesTracePositionFilter(candidate: number | undefined, position: number | '') {
  if (position === '')
    return true

  return candidate === position
}
