import * as process from 'node:process'

type ShellPlatform = NodeJS.Platform
const traceDirVariable = '$' + '{traceDir}'

export function quoteShellArg(arg: string, platform: ShellPlatform = process.platform): string {
  if (platform === 'win32')
    return `"${arg.replace(/"/g, '""')}"`

  return `'${arg.replace(/'/g, '\'\\\'\'')}'`
}

export function buildTraceCommand(traceCmd: string, traceDir: string, platform: ShellPlatform = process.platform): string {
  return traceCmd.split(traceDirVariable).join(quoteShellArg(traceDir, platform))
}
