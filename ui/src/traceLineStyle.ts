import type { TraceLine } from '../../shared/src/traceData'

const CATEGORY_COLORS = [
  {
    match: /check|type/i,
    color: 'var(--vscode-charts-blue, var(--vscode-terminal-ansiBlue, #3794ff))',
  },
  {
    match: /parse|bind|program/i,
    color: 'var(--vscode-charts-purple, var(--vscode-terminal-ansiMagenta, #b180d7))',
  },
  {
    match: /emit|transform/i,
    color: 'var(--vscode-charts-green, var(--vscode-terminal-ansiGreen, #89d185))',
  },
  {
    match: /io|file|module/i,
    color: 'var(--vscode-charts-yellow, var(--vscode-terminal-ansiYellow, #cca700))',
  },
] as const

export function getTraceLineAccent(line: TraceLine) {
  const searchable = `${line.cat} ${line.name}`
  return CATEGORY_COLORS.find(({ match }) => match.test(searchable))?.color
    ?? 'var(--vscode-foreground, #cccccc)'
}

export function getTraceDurationColor(duration = 0) {
  if (duration >= 50_000)
    return 'var(--vscode-errorForeground, #f48771)'

  if (duration >= 5_000)
    return 'var(--vscode-editorWarning-foreground, var(--vscode-terminal-ansiYellow, #cca700))'

  return 'var(--vscode-descriptionForeground, #8b949e)'
}

export function getTraceLineStyle(line: TraceLine) {
  const accent = getTraceLineAccent(line)

  return {
    borderLeftColor: accent,
    background: `linear-gradient(90deg, ${accent}22 0, transparent 1.5rem)`,
  }
}
