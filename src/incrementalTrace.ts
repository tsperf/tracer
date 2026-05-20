export interface TraceCompilerOptions {
  composite?: boolean
  incremental?: boolean
}

function hasEnabledCliFlag(command: string, flag: string) {
  const escapedFlag = flag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = command.match(new RegExp(`(?:^|\\s)${escapedFlag}(?:=([^\\s]+)|\\s+([^\\s]+)|\\s|$)`))
  if (!match)
    return false

  const value = match[1] ?? match[2]
  return value === undefined || !['false', '0'].includes(value.toLowerCase())
}

function isBuildCommand(command: string) {
  return /(?:^|\s)(?:--build|-b)(?:\s|$)/.test(command)
}

export function getIncrementalTraceReason(command: string, options: TraceCompilerOptions) {
  if (!hasEnabledCliFlag(command, '--generateTrace'))
    return undefined

  if (isBuildCommand(command))
    return 'TypeScript build mode'

  if (hasEnabledCliFlag(command, '--incremental') || options.incremental)
    return 'incremental builds'

  if (hasEnabledCliFlag(command, '--composite') || options.composite)
    return 'composite projects'

  return undefined
}
