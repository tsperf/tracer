export function getTraceRootDuration(currentDuration: number, line: { ts: number, dur?: number }): number {
  if (line.dur === Number.MAX_SAFE_INTEGER)
    return currentDuration

  return Math.max(currentDuration, line.ts + (line.dur ?? 0))
}
