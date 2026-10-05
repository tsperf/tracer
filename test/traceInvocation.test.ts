import { strict as assert } from 'node:assert'
import { describe, it } from 'vitest'
import { createTraceInvocation } from '../src/traceInvocation'

// eslint-disable-next-line no-template-curly-in-string
const traceCmd = 'npx tsc --noEmit --generateTrace ${traceDir}'

const windowsOptions = {
  traceCmd,
  workspacePath: 'P:\\My projects\\app',
  traceDir: 'C:\\Users\\Name With Space\\globalStorage\\app\\default\\traces',
}

describe('trace invocation', () => {
  it('runs command-palette tracing in the workspace on another drive', () => {
    assert.deepEqual(createTraceInvocation(windowsOptions, 'win32', ''), {
      command: `npx tsc --noEmit --generateTrace "${windowsOptions.traceDir}"`,
      cwd: windowsOptions.workspacePath,
      shell: true,
    })
  })

  it('runs explorer tracing in the selected directory without shell cd', () => {
    const directory = 'D:\\Other projects\\it\'s here'
    const invocation = createTraceInvocation({ ...windowsOptions, directory }, 'win32', '/bin/bash')
    assert.equal(invocation?.cwd, directory)
    assert.equal(invocation?.shell, true)
    assert.equal(invocation?.command, `npx tsc --noEmit --generateTrace "${windowsOptions.traceDir}"`)
  })

  it('preserves POSIX quoting, literal dollar sequences, and the configured shell', () => {
    assert.deepEqual(createTraceInvocation({
      traceCmd,
      workspacePath: '/work/my project',
      traceDir: '/tmp/it\'s $& data/traces',
    }, 'linux', '/bin/sh'), {
      command: 'npx tsc --noEmit --generateTrace \'/tmp/it\'\\\'\'s $& data/traces\'',
      cwd: '/work/my project',
      shell: '/bin/sh',
    })
  })

  it('does not create an invocation without a working directory', () => {
    assert.equal(createTraceInvocation({ ...windowsOptions, workspacePath: '' }), undefined)
    assert.equal(createTraceInvocation(windowsOptions, 'linux', '')?.shell, true)
  })
})
