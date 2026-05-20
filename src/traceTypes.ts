import type { TraceData, TraceLine, TypeLine } from '../shared/src/traceData'

export type TypeLineIndex = Map<number, TypeLine>

export function createTypeLineIndex(traceData: TraceData): TypeLineIndex {
  const typeLines = new Map<number, TypeLine>()

  for (const line of traceData) {
    if ('id' in line)
      typeLines.set(line.id, line)
  }

  return typeLines
}

export function getResultTypeForLine(line: TraceLine, typeLines: TypeLineIndex) {
  const typeId = line.args?.results?.typeId

  return typeId === undefined ? undefined : typeLines.get(typeId)
}
