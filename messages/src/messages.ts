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

export type Message = z.infer<typeof message>
export const message = z.union([ping, pong, gotoLocation, gotoPosition])
