import { describe, expect, it } from 'vitest'
import * as Messages from '../shared/src/messages'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('accepts known configuration update messages', () => {
    const parsed = Messages.message.safeParse({
      message: 'updateConfig',
      key: 'traceTimeThresholds',
      value: { info: 1, warning: -1, error: -1 },
    })

    expect(parsed.success).toBe(true)
  })

  it('rejects unknown configuration keys', () => {
    const parsed = Messages.message.safeParse({
      message: 'updateConfig',
      key: 'notARealSetting',
      value: true,
    })

    expect(parsed.success).toBe(false)
  })
})
