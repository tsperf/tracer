// arr must be sorted by ts
export function binSearch<T extends { ts: number }>(arr: T[], from: number, to: number): T[] {
  if (arr.length === 0 || from > to)
    return []

  let start = 0
  let end = arr.length

  while (start < end) {
    const mid = Math.trunc((start + end) / 2)
    if (arr[mid].ts < from)
      start = mid + 1
    else
      end = mid
  }

  const startPos = start

  end = arr.length
  while (start < end) {
    const mid = Math.trunc((start + end) / 2)
    if (arr[mid].ts <= to)
      start = mid + 1
    else
      end = mid
  }

  return arr.slice(startPos, start)
}
