import z from 'zod'

export const ping = z.object({
  message: z.literal('ping'),
})
export type Ping = z.infer<typeof ping>

export const pong = z.object({
  message: z.literal('pong'),
})
export type Pong = z.infer<typeof pong>

export const gotoPosition = z.object({
  message: z.literal('gotoPosition'),
  fileName: z.string(),
  pos: z.number(),
})
export type GotoPosition = z.infer<typeof gotoPosition>

export const gotoLocation = z.object({
  message: z.literal('gotoLocation'),
  fileName: z.string(),
  line: z.number(),
  character: z.number(),
})
export type GotoLocation = z.infer<typeof gotoPosition>

export const traceFile = z.object({
  message: z.literal('traceFile'),
  fileName: z.string(),
  traceString: z.string(),
})
export type TraceFile = z.infer<typeof traceFile>

export const gotoTracePosition = z.object({
  message: z.literal('gotoTracePosition'),
  fileName: z.string(),
  position: z.number(),
})
export type GotoTracePosition = z.infer<typeof gotoTracePosition>

export const positionTypeCounts = z.object({
  message: z.literal('postionTypeCounts'),
  counts: z.record(z.string(), z.record(z.string(), z.number())),
})
export type PositionTypeCounts = z.infer<typeof positionTypeCounts>

export const fileStat = z.object({
  pos: z.number(),
  end: z.number(),
  dur: z.number(),
  types: z.number(),
  totalTypes: z.number(),
})
export type FileStat = z.infer<typeof fileStat>

export const fileStats = z.object({
  message: z.literal('fileStats'),
  fileName: z.string(),
  stats: z.array(fileStat),
})
export type FileStats = z.infer<typeof fileStats>

export type Message = z.infer<typeof message>
export const message = z.union([ping, pong, gotoLocation, gotoPosition, traceFile, gotoTracePosition, positionTypeCounts, fileStats])
