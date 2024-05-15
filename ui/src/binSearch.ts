// arr must be sorted by ts
export function binSearch<T extends { ts: number }>(arr: T[], from: number, to: number): T[] {
  if (arr.length === 0 || from > to)
    return arr

  let idx = Math.trunc(arr.length / 2)
  let upperBound = arr.length
  let lowerBound = 0

  while (arr[idx].ts <= to) {
    upperBound = idx
    idx = Math.trunc(idx / 2)
  }

  while (arr[idx].ts > to) {
    lowerBound = idx
    idx = Math.round(idx + (upperBound - idx) / 2)
  }

  const endPos = lowerBound

  upperBound = lowerBound
  lowerBound = 0
  while (arr[idx].ts > from) {
    lowerBound = idx
    idx = Math.round(idx + (upperBound - idx) / 2)
  }

  while (arr[idx].ts <= from) {
    upperBound = idx
    idx = Math.trunc(idx / 2)
  }

  const startPos = upperBound

  return arr.slice(startPos, endPos + 1)
}
