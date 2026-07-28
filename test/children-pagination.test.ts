import { describe, expect, it } from 'vitest'
import { pageItems } from '../src/childPaging'

describe('pageItems', () => {
  it('returns a paged slice and metadata', () => {
    const first = pageItems([1, 2, 3], 0, 2)
    expect(first.total).toBe(3)
    expect(first.hasMore).toBe(true)
    expect(first.items).toEqual([1, 2])

    const second = pageItems([1, 2, 3], 2, 2)
    expect(second.total).toBe(3)
    expect(second.hasMore).toBe(false)
    expect(second.items).toEqual([3])
  })
})
