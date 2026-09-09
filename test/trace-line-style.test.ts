import { describe, expect, it } from 'vitest'
import { getTraceDurationColor, getTraceLineAccent, getTraceLineStyle } from '../ui/src/traceLineStyle'

describe('trace line styles', () => {
  it('uses semantic vscode color variables for common trace categories', () => {
    expect(getTraceLineAccent({
      pid: 1,
      tid: 1,
      ph: 'X',
      cat: 'checkTypes',
      ts: 0,
      name: 'structuredTypeRelatedTo',
    })).toContain('--vscode-charts-blue')

    expect(getTraceLineAccent({
      pid: 1,
      tid: 1,
      ph: 'X',
      cat: 'program',
      ts: 0,
      name: 'createProgram',
    })).toContain('--vscode-charts-purple')
  })

  it('highlights slow trace lines with warning and error colors', () => {
    expect(getTraceDurationColor(4_999)).toContain('--vscode-descriptionForeground')
    expect(getTraceDurationColor(5_000)).toContain('--vscode-editorWarning-foreground')
    expect(getTraceDurationColor(50_000)).toContain('--vscode-errorForeground')
  })

  it('returns a border and subtle background accent', () => {
    const style = getTraceLineStyle({
      pid: 1,
      tid: 1,
      ph: 'X',
      cat: 'emit',
      ts: 0,
      name: 'emitFile',
    })

    expect(style.borderLeftColor).toContain('--vscode-charts-green')
    expect(style.background).toContain('linear-gradient')
  })
})
