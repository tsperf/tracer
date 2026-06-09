import { describe, expect, it } from 'vitest'
import { buildTraceShellCommand, quoteShellArg } from '../src/shellCommand'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })
})

describe('shell command generation', () => {
  it('uses cd /d and Windows quoting when running a trace on Windows', () => {
    const command = buildTraceShellCommand(
      'p:\\_godot\\godot-vscode-plugin',
      'npx tsc --noEmit --generateTrace $' + '{traceDir}',
      'c:\\Users\\daelon\\AppData\\Roaming\\Code\\User\\globalStorage\\tsperf.tracer\\godot-tools\\default\\traces',
      'win32',
    )

    expect(command).toBe('(cd /d "p:\\_godot\\godot-vscode-plugin" && npx tsc --noEmit --generateTrace "c:\\Users\\daelon\\AppData\\Roaming\\Code\\User\\globalStorage\\tsperf.tracer\\godot-tools\\default\\traces")')
  })

  it('keeps POSIX paths single quoted and safely escapes apostrophes', () => {
    expect(quoteShellArg('/tmp/project with spaces/owner\'s')).toBe('\'/tmp/project with spaces/owner\'\\\'\'s\'')
  })
})
