export function parsePathExcludes(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map(value => value.trim().replace(/\\/g, '/').toLowerCase())
    .filter(Boolean)
}

export function isPathExcluded(path: string | undefined, excludes: readonly string[]) {
  if (!path || excludes.length === 0)
    return false

  const normalizedPath = path.replace(/\\/g, '/').toLowerCase()
  return excludes.some(exclude => normalizedPath.includes(exclude))
}
