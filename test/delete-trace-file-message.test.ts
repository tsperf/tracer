import { describe, expect, it } from 'vitest'
import { message } from '../shared/src/messages'

describe('deleteTraceFile message', () => {
  it('accepts the corrected message name', () => {
    const parsed = message.safeParse({
      dirName: 'traces',
      fileName: 'trace.json',
      message: 'deleteTraceFile',
    })

    expect(parsed.success).toBe(true)
  })

  it('keeps accepting the legacy misspelled message name', () => {
    const parsed = message.safeParse({
      dirName: 'traces',
      fileName: 'trace.json',
      message: 'deletTraceFile',
    })

    expect(parsed.success).toBe(true)
  })
})
