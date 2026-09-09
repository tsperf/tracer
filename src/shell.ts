import * as process from 'node:process'

export function quoteShellArg(value: string, platform: NodeJS.Platform = process.platform) {
  if (platform === 'win32') {
    return `"${value.replace(/"/g, '\\"')}"`
  }

  return `'${value.replace(/'/g, `'\\''`)}'`
}

export function createTraceCommand(traceCmd: string, traceDir: string, platform: NodeJS.Platform = process.platform) {
  const traceDirPlaceholder = '$' + '{traceDir}'

  return traceCmd.replace(traceDirPlaceholder, quoteShellArg(traceDir, platform))
}
