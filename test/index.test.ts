import { describe, expect, it } from 'vitest'
import { createTraceCommand, quoteShellArg } from '../src/shell'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })
})

describe('shell command helpers', () => {
  it('quotes trace directories for posix shells', () => {
    expect(quoteShellArg('/tmp/a b/trace', 'darwin')).toBe('\'/tmp/a b/trace\'')
    expect(quoteShellArg('/tmp/it\'s/trace', 'linux')).toBe('\'/tmp/it\'\\\'\'s/trace\'')
  })

  it('quotes trace directories for windows shells', () => {
    expect(quoteShellArg('c:\\Users\\Name With Space\\trace', 'win32')).toBe('"c:\\Users\\Name With Space\\trace"')
  })

  it('builds the trace command without embedding a cd command', () => {
    const traceDirPlaceholder = '$' + '{traceDir}'
    const command = createTraceCommand(`npx tsc --noEmit --generateTrace ${traceDirPlaceholder}`, 'p:\\_godot\\trace', 'win32')

    expect(command).toBe('npx tsc --noEmit --generateTrace "p:\\_godot\\trace"')
    expect(command).not.toContain('cd ')
  })
})
