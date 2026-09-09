import { describe, expect, it } from 'vitest'
import { getTracePositionFromEditorOffset } from '../src/editorTracePosition'

describe('getTracePositionFromEditorOffset', () => {
  it('clamps the first editor offset to zero', () => {
    expect(getTracePositionFromEditorOffset('const value = 1', 0)).toBe(0)
  })

  it('keeps the current offset before a newline', () => {
    expect(getTracePositionFromEditorOffset('a\nb', 0)).toBe(0)
  })

  it('keeps the previous-offset lookup for normal positions', () => {
    expect(getTracePositionFromEditorOffset('const value = 1', 6)).toBe(5)
  })
})
