import * as process from 'node:process'

type Platform = NodeJS.Platform
const traceDirToken = '$' + '{traceDir}'

function quotePosixShellArg(value: string) {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

function quoteWindowsShellArg(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}

export function quoteShellArg(value: string, platform: Platform = process.platform) {
  return platform === 'win32' ? quoteWindowsShellArg(value) : quotePosixShellArg(value)
}

export function buildTraceShellCommand(
  cwd: string,
  traceCmd: string,
  traceDir: string,
  platform: Platform = process.platform,
) {
  const command = traceCmd.replace(traceDirToken, quoteShellArg(traceDir, platform))

  if (platform === 'win32')
    return `(cd /d ${quoteShellArg(cwd, platform)} && ${command})`

  return `(cd ${quoteShellArg(cwd, platform)} && ${command})`
}
