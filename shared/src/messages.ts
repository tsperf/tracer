import z from 'zod'
import type { Tree } from './traceTree'
import { traceLine, typeLine } from './traceData'

export const ping = z.object({
  message: z.literal('ping'),
  text: z.string().optional(),
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

export const traceFileLoaded = z.object({
  message: z.literal('traceFileLoaded'),
  fileName: z.string(),
  dirName: z.string(),
})
export type TraceFileLoaded = z.infer<typeof traceFileLoaded>

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

export const filterTree = z.object({
  message: z.literal('filterTree'),
  startsWith: z.string(),
  sourceFileName: z.string(),
  position: z.literal('').or(z.number()),
})
export type FilterTree = z.infer<typeof filterTree>

const zodTree: z.ZodType<Tree> = z.lazy(() =>
  z.object({
    id: z.number(),
    line: traceLine,
    children: z.array(zodTree),
    types: z.array(typeLine),
    childTypeCnt: z.number(),
  }),
)

const showTree = z.object({
  message: z.literal('showTree'),
  nodes: z.array(zodTree),
})
export type ShowTree = z.infer<typeof showTree>

// TODO: result message for filter tree
// message for getting tree by id and result message

export type Message = z.infer<typeof message>
export const message = z.union([
  ping,
  pong,
  filterTree,
  gotoLocation,
  gotoPosition,
  gotoTracePosition,
  positionTypeCounts,
  fileStats,
  showTree,
  traceStart,
  traceStop,
  traceFileLoaded,
  log,
])

export type MessageType = Message['message']

export type SpecificMessage<T extends MessageType> = Message & { message: T }
export type MessageValues<T extends MessageType> = Omit<SpecificMessage<T>, 'message'>
