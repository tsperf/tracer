export function hasTracePosition(path: string | undefined, pos: number | undefined): path is string {
  return Boolean(path) && pos !== undefined
}
