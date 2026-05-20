import { describe, expect, it } from 'vitest'
import { getTraceLineTone, getTraceLineToneStyle } from '../src/traceTone'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('colors slow trace lines by duration', () => {
    expect(getTraceLineTone({
      line: { pid: 1, tid: 1, ph: 'X', cat: 'check', ts: 1, name: 'checkExpression', dur: 50_000 },
      typeCnt: 0,
      childTypeCnt: 0,
    })).toBe('slow')
  })

  it('colors type-heavy trace lines separately from slow lines', () => {
    expect(getTraceLineTone({
      line: { pid: 1, tid: 1, ph: 'X', cat: 'check', ts: 1, name: 'checkExpression', dur: 10 },
      typeCnt: 40,
      childTypeCnt: 60,
    })).toBe('type-heavy')
  })

  it('uses a mixed tone for slow and type-heavy trace lines', () => {
    expect(getTraceLineTone({
      line: { pid: 1, tid: 1, ph: 'X', cat: 'check', ts: 1, name: 'checkExpression', dur: 50_000 },
      typeCnt: 100,
      childTypeCnt: 0,
    })).toBe('mixed')
  })

  it('uses theme variables for trace tone styles', () => {
    expect(getTraceLineToneStyle('slow')['--trace-line-accent']).toContain('--vscode-charts-orange')
    expect(getTraceLineToneStyle('type-heavy')['--trace-line-accent']).toContain('--vscode-charts-purple')
  })
})
