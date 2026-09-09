import { z } from 'zod'

export type TypeLine = z.infer<typeof typeLine>
export const typeLine = z.object({
  id: z.number(),
  intrinsicName: z.string().optional(),
  recursionId: z.number().optional(),
  flags: z.array(z.string()).optional(),
  ts: z.number(),
  dur: z.number().optional(),
  display: z.string().optional(),
})

export function describeTypeLine(line?: TypeLine) {
  if (!line)
    return 'unresolved type'

  const name = line.display?.trim() || line.intrinsicName?.trim() || `Type ${line.id}`
  const details = [
    `id=${line.id}`,
    line.recursionId !== undefined ? `recursionId=${line.recursionId}` : undefined,
    line.flags?.length ? line.flags.join(', ') : undefined,
  ].filter((x): x is string => !!x)

  return details.length ? `${name} (${details.join(' · ')})` : name
}

export const traceLineTypeArgNames = {
  structuredTypeRelatedTo: ['sourceId', 'targetId'],
} as const

export type TraceTypeRef = z.infer<typeof traceTypeRef>
export const traceTypeRef = z.object({
  key: z.string(),
  typeId: z.number(),
  type: typeLine.optional(),
  label: z.string(),
  title: z.string(),
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
        .passthrough()
        .optional(),
    })
    .passthrough()
    .optional(),
})

export function getTraceLineTypeRefs(line: TraceLine, typeById = new Map<number, TypeLine>()) {
  const args = line.args
  if (!args)
    return []

  const refs: TraceTypeRef[] = []
  const seenKeys = new Set<string>()
  const knownKeys = traceLineTypeArgNames[line.name as keyof typeof traceLineTypeArgNames] ?? []

  function pushRef(key: string, typeId: unknown) {
    if (seenKeys.has(key) || typeof typeId !== 'number')
      return

    seenKeys.add(key)
    const type = typeById.get(typeId)
    refs.push({
      key,
      typeId,
      type,
      label: type?.display?.trim() || type?.intrinsicName?.trim() || `Type ${typeId}`,
      title: describeTypeLine(type),
    })
  }

  for (const key of knownKeys)
    pushRef(key, args[key as keyof typeof args])

  for (const [key, value] of Object.entries(args)) {
    if (key === 'results' && value && typeof value === 'object' && 'typeId' in value)
      pushRef(`${key}.typeId`, (value as { typeId?: unknown }).typeId)
    else if (key.endsWith('Id'))
      pushRef(key, value)
  }

  return refs
}

export type DataLine = TraceLine | TypeLine

export type TraceData = z.infer<typeof traceData>
export const traceData = z.array(typeLine.or(traceLine))
