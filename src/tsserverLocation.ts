export function toTsserverLocation(line: number, offset: number): { line: number, offset: number } {
  return {
    line: line + 1,
    offset: offset + 1,
  }
}
