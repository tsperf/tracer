import { describe, expect, it } from 'vitest'
import { message } from '../shared/src/messages'

describe('messages', () => {
  it('preserves trace severity fields on tree messages', () => {
    const parsed = message.safeParse({
      message: 'showTree',
      step: 'add',
      nodes: [
        {
          id: 1,
          line: {
            pid: 1,
            tid: 1,
            ph: 'X',
            cat: 'check',
            ts: 0,
            name: 'checkSourceFile',
            dur: 2000,
          },
          children: [],
          types: [
            {
              id: 100,
              ts: 0,
              dur: 2000,
              timeSeverity: 'warning',
            },
          ],
          childTypeCnt: 2,
          childCnt: 0,
          typeCnt: 1,
          timeSeverity: 'warning',
          typeSeverity: 'info',
          totalTypeSeverity: 'error',
        },
      ],
    })

    expect(parsed.success).toBe(true)
    if (!parsed.success)
      return

    expect(parsed.data.message).toBe('showTree')
    if (parsed.data.message !== 'showTree')
      return

    expect(parsed.data.nodes[0].timeSeverity).toBe('warning')
    expect(parsed.data.nodes[0].typeSeverity).toBe('info')
    expect(parsed.data.nodes[0].totalTypeSeverity).toBe('error')
    expect(parsed.data.nodes[0].types[0].timeSeverity).toBe('warning')
  })
})
