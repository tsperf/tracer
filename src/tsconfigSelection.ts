import path from 'node:path'

export function findClosestTsconfig(filePath: string, tsconfigPaths: string[]): string | undefined {
  const normalizedFilePath = normalizePath(filePath)
  const candidates = tsconfigPaths
    .filter(tsconfigPath => !isNodeModulesPath(tsconfigPath))
    .sort((a, b) => b.length - a.length)

  return candidates.find((tsconfigPath) => {
    const configDirectory = normalizePath(path.dirname(tsconfigPath))
    return normalizedFilePath === configDirectory || normalizedFilePath.startsWith(`${configDirectory}/`)
  }) ?? candidates[0]
}

function normalizePath(filePath: string) {
  return filePath.replaceAll('\\', '/').replace(/\/+$/, '')
}

function isNodeModulesPath(filePath: string) {
  return normalizePath(filePath).split('/').includes('node_modules')
}
