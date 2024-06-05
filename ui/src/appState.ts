import type { TypeLine } from '../../shared/src/traceData'
import type { Tree } from '../../src/traceTree'
import * as Messages from '../../shared/src/messages'

export const childrenById = shallowReactive(new Map<number, Tree[]>())
export const typesById = shallowReactive(new Map<number, TypeLine[]>())
export const nodes = ref([] as Tree[])
export const sortBy = ref('Timestamp' as keyof typeof sortValue)

const sortValue = {
  'Timestamp': (t: Tree) => t.line.ts,
  'Duration': (t: Tree) => -(t.line.dur ?? 0),
  'Types': (t: Tree) => -t.typeCnt,
  'Total Types': (t: Tree) => -(t.childTypeCnt + t.typeCnt),
} as const

function doSort(arr: Tree[]) {
  const ord = sortValue[sortBy.value]
  return ord ? arr.toSorted((a, b) => ord(a) - ord(b)) : arr
}

watch(sortBy, () => nodes.value = doSort(nodes.value ?? []))

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
    case 'showTree': {
      switch (parsed.data.step) {
        case 'start':
          nodes.value = []
          break
        case 'add':
          nodes.value = doSort([...nodes.value, ...parsed.data.nodes])
          break
        case 'done':
          break
      }
    }
  }
}

window.addEventListener('message', handleMessage)
