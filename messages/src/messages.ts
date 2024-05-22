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

export const traceFileStart = z.object({
  message: z.literal('traceFileStart'),
  fileName: z.string(),
  size: z.number(),
})
export type TraceFileStart = z.infer<typeof traceFileStart>

export const traceFileEnd = z.object({
  message: z.literal('traceFileEnd'),
  fileName: z.string(),
})
export type TraceFileEnd = z.infer<typeof traceFileEnd>

export const traceFileChunk = z.object({
  message: z.literal('traceFileChunk'),
  fileName: z.string(),
  chunk: z.string(),
})
export type TraceFileChunk = z.infer<typeof traceFileChunk>

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

export const traceStart = z.object({
  message: z.literal('traceStart'),
})
export type TraceStart = z.infer<typeof traceStart>

export const traceStop = z.object({
  message: z.literal('traceStop'),
})
export type TraceStop = z.infer<typeof traceStop>

export const log = z.object({
  message: z.literal('log'),
  value: z.array(z.any()),
})
export type Log = z.infer<typeof log>

export type Message = z.infer<typeof message>
export const message = z.union([
  ping,
  pong,
  gotoLocation,
  gotoPosition,
  traceFileChunk,
  traceFileEnd,
  traceFileStart,
  gotoTracePosition,
  positionTypeCounts,
  fileStats,
  traceStart,
  traceStop,
  log,
])
