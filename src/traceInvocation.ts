import * as process from 'node:process'

interface TraceInvocationOptions {
  traceCmd: string
  traceDir: string
  workspacePath: string
  directory?: string
}

export function createTraceInvocation(
  { traceCmd, traceDir, workspacePath, directory }: TraceInvocationOptions,
  platform: NodeJS.Platform = process.platform,
  shell = process.env.SHELL,
) {
  // projectPath is extension storage; the compiler must run in the source tree.
  const cwd = directory ?? workspacePath
  if (!cwd)
    return

  const quotedTraceDir = platform === 'win32'
    ? `"${traceDir}"`
    : `'${traceDir.replace(/'/g, `'\\''`)}'`

  return {
    // A replacement callback preserves literal dollar sequences in path names.
    // eslint-disable-next-line no-template-curly-in-string
    command: traceCmd.replace('${traceDir}', () => quotedTraceDir),
    cwd,
    shell: platform === 'win32' ? true : shell || true,
  }
}
