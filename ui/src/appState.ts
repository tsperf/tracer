import type { TypeLine } from '../../shared/src/traceData'
import type { Tree } from '../../src/traceTree'
import * as Messages from '../../shared/src/messages'

export const childrenById = shallowReactive(new Map<number, Tree[]>())
export const typesById = shallowReactive(new Map<number, TypeLine[]>())

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  switch (parsed.data.message) {
    case 'childrenById': {
      if (!parsed.data.children)
        return
      const id = parsed.data.id
      const children = childrenById.get(id) ?? []
      childrenById.set(id, [...children, ...parsed.data.children])
      break
    }
    case 'typesById': {
      if (!parsed.data.types)
        return
      const id = parsed.data.id
      const types = typesById.get(id) ?? []
      typesById.set(id, [...types, ...parsed.data.types])
      break
    }
  }
}

window.addEventListener('message', handleMessage)
