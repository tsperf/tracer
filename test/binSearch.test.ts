import { describe, expect, it } from 'vitest'
import { binSearch } from '../ui/src/binSearch'

describe('binSearch', () => {
  const rows = [
    { ts: 10, label: 'a' },
    { ts: 20, label: 'b' },
    { ts: 30, label: 'c' },
    { ts: 40, label: 'd' },
  ]

  it('returns items inside the inclusive range', () => {
    expect(binSearch(rows, 20, 30).map(row => row.label)).toEqual(['b', 'c'])
  })

  it('handles ranges that start before or end after the array', () => {
    expect(binSearch(rows, 0, 20).map(row => row.label)).toEqual(['a', 'b'])
    expect(binSearch(rows, 30, 100).map(row => row.label)).toEqual(['c', 'd'])
  })

  it('returns an empty array when the range misses the array', () => {
    expect(binSearch(rows, 0, 5)).toEqual([])
    expect(binSearch(rows, 45, 100)).toEqual([])
  })

  it('handles empty, single-item, and invalid ranges', () => {
    expect(binSearch([], 0, 100)).toEqual([])
    expect(binSearch([{ ts: 0 }], 0, 0)).toEqual([{ ts: 0 }])
    expect(binSearch([{ ts: 0 }], 1, 1)).toEqual([])
    expect(binSearch(rows, 30, 20)).toEqual([])
  })
})
