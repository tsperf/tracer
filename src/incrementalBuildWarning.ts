import { existsSync } from 'node:fs'
import { basename, dirname, join, parse, resolve } from 'node:path'
import type * as ts from 'typescript'

export function findTsconfig(startPath: string, stopPath?: string) {
  let dir = resolve(startPath)
  const root = parse(dir).root
  const stop = stopPath ? resolve(stopPath) : root

  while (true) {
    const tsconfigPath = join(dir, 'tsconfig.json')
    if (existsSync(tsconfigPath))
      return tsconfigPath

    if (dir === stop || dir === root)
      return

    dir = dirname(dir)
  }
}

export function hasIncrementalBuildEnabled(options: ts.CompilerOptions) {
  return options.incremental === true || options.composite === true
}

export function getIncrementalBuildWarning(tsApi: typeof ts, projectPath: string, workspacePath?: string) {
  const tsconfigPath = findTsconfig(projectPath, workspacePath)
  if (!tsconfigPath)
    return

  const configFile = tsApi.readConfigFile(tsconfigPath, tsApi.sys.readFile)
  if (configFile.error)
    return

  const parsed = tsApi.parseJsonConfigFileContent(configFile.config, tsApi.sys, dirname(tsconfigPath))
  if (!hasIncrementalBuildEnabled(parsed.options))
    return

  return `Trace completed with incremental builds enabled in ${basename(tsconfigPath)}. Incremental caches can skew trace timings; consider disabling "incremental" or "composite" before comparing results.`
}
