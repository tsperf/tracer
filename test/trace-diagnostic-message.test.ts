import { describe, expect, it } from 'vitest'
import { formatRelativeTraceDiagnosticMessage, formatTraceDiagnosticMessage } from '../src/traceDiagnosticMessage'

describe('trace diagnostic messages', () => {
  it('labels trace metrics clearly', () => {
    expect(formatTraceDiagnosticMessage({ dur: 12345, types: 2, totalTypes: 7 })).toContain('Trace check ms:')
  })

  it('labels relative trace metrics clearly', () => {
    const msg = formatRelativeTraceDiagnosticMessage(
      { dur: 1000, types: 3, totalTypes: 8 },
      { dur: 500, types: 2, totalTypes: 4 },
    )

    expect(msg).toContain('Trace check ms:')
    expect(msg).toContain('%')
  })
})
