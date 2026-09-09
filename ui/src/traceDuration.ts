export function formatTraceDurationMs(duration: number | undefined): string {
  return `${Math.round(duration ?? 0) / 1000}ms`
}
