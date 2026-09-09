import process from 'node:process'

const posixShellPattern = /(?:^|[\\/])(?:bash|dash|fish|ksh|sh|zsh)(?:\.exe)?$/i
const traceDirPlaceholder = '${' + 'traceDir}'

export function shouldUsePosixQuoting(platform: NodeJS.Platform, shell?: string) {
  if (shell && posixShellPattern.test(shell))
    return true

  return platform !== 'win32'
}

export function quoteForShell(value: string, opts?: { platform?: NodeJS.Platform, shell?: string }) {
  const platform = opts?.platform ?? process.platform
  const shell = opts?.shell

  if (!shouldUsePosixQuoting(platform, shell))
    return `"${value.replace(/"/g, '""')}"`

  return `'${value.replace(/'/g, `'\\''`)}'`
}

export function buildTraceCommand(traceCmd: string, traceDir: string, opts?: { platform?: NodeJS.Platform, shell?: string }) {
  return traceCmd.replace(traceDirPlaceholder, quoteForShell(traceDir, opts))
}

export function resolveTraceShell(shell?: string): string | true {
  return shell || true
}
