import { describe, expect, it } from 'vitest'
import type { GotoLocation } from '../shared/src/messages'

describe('gotoLocation message type', () => {
  it('matches the gotoLocation schema shape', () => {
    const message: GotoLocation = {
      character: 3,
      fileName: 'src/index.ts',
      line: 12,
      message: 'gotoLocation',
    }

    expect(message.message).toBe('gotoLocation')
    expect(message.fileName).toBe('src/index.ts')
  })
})
