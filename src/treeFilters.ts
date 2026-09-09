export interface FilterTreeNode {
  line: {
    name?: string
    args?: {
      path?: string
    }
  }
  children: FilterTreeNode[]
}

export interface TreeChildFilters {
  childStartsWith: string
  excludePathIncludes: string
}

export function parseFilterList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map(x => x.trim().toLowerCase())
    .filter(Boolean)
}

export function isPathExcluded(path: string | undefined, excludes: readonly string[]): boolean {
  if (!path || excludes.length === 0)
    return false

  const normalizedPath = path.toLowerCase()
  return excludes.some(exclude => normalizedPath.includes(exclude))
}

function matchesChildName(node: FilterTreeNode, childStartsWith: string): boolean {
  return !childStartsWith || !!node.line.name?.startsWith(childStartsWith)
}

export function hasVisibleChildBranch(node: FilterTreeNode, childStartsWith: string, excludes: readonly string[]): boolean {
  if (isPathExcluded(node.line.args?.path, excludes))
    return false

  return matchesChildName(node, childStartsWith)
    || node.children.some(child => hasVisibleChildBranch(child, childStartsWith, excludes))
}

export function getVisibleChildren<T extends FilterTreeNode>(node: T, filters: TreeChildFilters): T[] {
  const excludes = parseFilterList(filters.excludePathIncludes)
  const children = node.children as T[]

  return children.filter(child =>
    hasVisibleChildBranch(child, filters.childStartsWith, excludes),
  )
}
