import { describe, expect, it } from 'vitest'
import { buildTraceCommand, quoteForShell, resolveTraceShell, shouldUsePosixQuoting } from '../src/shell'

describe('shell helpers', () => {
  const traceCmd = 'npx tsc --generateTrace ' + '${' + 'traceDir}'

  it('uses default Windows quoting when no explicit shell is configured', () => {
    expect(buildTraceCommand(traceCmd, 'C:\\Users\\me\\trace dir', { platform: 'win32' }))
      .toBe('npx tsc --generateTrace "C:\\Users\\me\\trace dir"')
  })

  it('uses POSIX quoting when the configured shell is bash on Windows', () => {
    expect(buildTraceCommand(traceCmd, 'C:\\Users\\me\\trace dir', {
      platform: 'win32',
      shell: 'C:\\Program Files\\Git\\bin\\bash.exe',
    })).toBe(`npx tsc --generateTrace 'C:\\Users\\me\\trace dir'`)
  })

  it('escapes single quotes for POSIX shells', () => {
    expect(quoteForShell(`/tmp/it's here`, { platform: 'linux' })).toBe(`'/tmp/it'\\''s here'`)
  })

  it('falls back to the platform default shell when SHELL is absent', () => {
    expect(resolveTraceShell()).toBe(true)
  })

  it('keeps an explicit shell path when provided', () => {
    expect(resolveTraceShell('/bin/zsh')).toBe('/bin/zsh')
  })

  it('detects POSIX shells from the shell executable path', () => {
    expect(shouldUsePosixQuoting('win32', 'C:\\Program Files\\Git\\bin\\bash.exe')).toBe(true)
    expect(shouldUsePosixQuoting('linux')).toBe(true)
    expect(shouldUsePosixQuoting('win32')).toBe(false)
  })
})
