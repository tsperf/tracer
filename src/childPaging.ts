export function pageItems<T>(items: readonly T[], offset = 0, limit = 100) {
  const safeOffset = Math.max(0, offset)
  const safeLimit = Math.max(1, limit)
  const children = items.slice(safeOffset, safeOffset + safeLimit)

  return {
    items: children,
    offset: safeOffset,
    limit: safeLimit,
    total: items.length,
    hasMore: safeOffset + children.length < items.length,
  }
}
