import { z } from 'zod'

export type TypeLine = z.infer<typeof typeLine>
export const typeLine = z.object({
  id: z.number(),
  intrinsicName: z.string().optional(),
  recursionId: z.number().optional(),
  flags: z.array(z.string()).optional(),
  ts: z.number().optional(),
  dur: z.number().optional(),
  display: z.string().optional(),
})

export type TraceLine = z.infer<typeof traceLine>
export const traceLine = z.object({
  pid: z.number(),
  tid: z.number(),
  ph: z.string(),
  cat: z.string(),
  ts: z.number(),
  name: z.string(),
  dur: z.number().optional(),
  args: z
    .object({
      kind: z.number().optional(),
      pos: z.number().optional(),
      end: z.number().optional(),
      path: z.string().optional(),
      results: z
        .object({
          typeId: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
})

export type DataLine = TraceLine | TypeLine

export type TraceData = z.infer<typeof traceData>
export const traceData = z.array(typeLine.or(traceLine))

export interface TraceDataSummary {
  totalTypes: number
  timestampedTypes: number
  untimestampedTypes: number
  parseWarning?: string
}

export function hasTypeTimestamp(line: TypeLine): line is TypeLine & { ts: number } {
  return typeof line.ts === 'number'
}

export function getTraceDataSummary(data: TraceData): TraceDataSummary {
  const typeLines = data.filter((line): line is TypeLine => 'id' in line)
  const timestampedTypes = typeLines.filter(hasTypeTimestamp).length
  const untimestampedTypes = typeLines.length - timestampedTypes

  return {
    totalTypes: typeLines.length,
    timestampedTypes,
    untimestampedTypes,
    parseWarning: untimestampedTypes > 0
      ? `${untimestampedTypes} type entr${untimestampedTypes === 1 ? 'y is' : 'ies are'} missing timestamps and cannot be attributed to trace spans.`
      : undefined,
  }
}
