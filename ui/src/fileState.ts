import type { TraceData } from './traceData'
import type { Tree } from './traceTree'

// I know useState is prefered, but I can't figure out how to do something like triggerRef with useState

export const files = shallowRef({} as Record<string, TraceData>)

export const traceTree = shallowRef(undefined as Tree | undefined)
