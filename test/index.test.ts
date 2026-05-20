import { describe, expect, it } from 'vitest'
import { formatRealtimeDiagnosticMessage, formatTraceDiagnosticMessage, formatTraceRelativeDiagnosticMessage } from '../src/diagnosticText'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('labels realtime diagnostics in the user-facing message', () => {
    expect(formatRealtimeDiagnosticMessage(12.4, 75)).toBe('Realtime tsserver: 12ms (+75%)')
  })

  it('labels trace diagnostics in the user-facing message', () => {
    expect(formatTraceDiagnosticMessage(12345.6, 10, 25)).toBe('Trace check: 12.346ms Types: 10 / 25')
  })

  it('labels relative trace diagnostics in the user-facing message', () => {
    expect(formatTraceRelativeDiagnosticMessage(1000, '(+50%)', 0, 20, '(+0%)', '(+200%)'))
      .toBe('Trace check: 1ms (+50%) Types: 0 / 20 (+0%) / (+200%)')
  })
})
