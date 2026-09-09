import type { CompilerOptions } from 'typescript'

export function getIncrementalTraceWarning(options: Pick<CompilerOptions, 'composite' | 'incremental' | 'tsBuildInfoFile'>) {
  if (!options.incremental && !options.composite)
    return undefined

  const enabledBy = options.incremental ? 'incremental' : 'composite'
  const buildInfo = options.tsBuildInfoFile ? ` (${options.tsBuildInfoFile})` : ''

  return `Tracing with ${enabledBy} builds enabled may reuse .tsbuildinfo${buildInfo} and produce traces that do not represent a clean type-check. Consider disabling incremental builds or deleting the build info file before comparing traces.`
}
