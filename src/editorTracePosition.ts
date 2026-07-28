export function getTracePositionFromEditorOffset(text: string, startOffset: number): number {
  const adjustment = text[startOffset + 1] === '\n' ? 0 : 1
  return Math.max(0, startOffset - adjustment)
}
