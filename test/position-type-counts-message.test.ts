import { describe, expect, it } from 'vitest'
import { message } from '../shared/src/messages'

describe('positionTypeCounts message', () => {
  it('accepts the correctly spelled message name', () => {
    const parsed = message.safeParse({
      counts: { 1: { 2: 3 } },
      message: 'positionTypeCounts',
    })

    expect(parsed.success).toBe(true)
  })

  it('keeps accepting the legacy misspelled message name', () => {
    const parsed = message.safeParse({
      counts: { 1: { 2: 3 } },
      message: 'postionTypeCounts',
    })

    expect(parsed.success).toBe(true)
  })
})
