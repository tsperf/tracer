import { describe, expect, it } from 'vitest'
import { buildTraceCommand, quoteShellArg } from '../src/shell'

describe('shell command helpers', () => {
  it('quotes trace directories for POSIX shells', () => {
    expect(quoteShellArg('/tmp/type traces')).toBe('\'/tmp/type traces\'')
    expect(quoteShellArg('/tmp/owner\'s traces')).toBe('\'/tmp/owner\'\\\'\'s traces\'')
  })

  it('quotes trace directories for Windows shells', () => {
    expect(quoteShellArg('c:\\Users\\me\\type traces', 'win32')).toBe('"c:\\Users\\me\\type traces"')
  })

  it('builds the trace command without changing directories in the shell command', () => {
    const traceDirVariable = '$' + '{traceDir}'
    const cmd = buildTraceCommand(
      `npx tsc --noEmit --generateTrace ${traceDirVariable}`,
      'c:\\Users\\me\\AppData\\Roaming\\Code\\User\\globalStorage\\tsperf.tracer\\project\\traces',
      'win32',
    )

    expect(cmd).toBe('npx tsc --noEmit --generateTrace "c:\\Users\\me\\AppData\\Roaming\\Code\\User\\globalStorage\\tsperf.tracer\\project\\traces"')
    expect(cmd).not.toContain('cd ')
  })
})
