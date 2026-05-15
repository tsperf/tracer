export function isDepthLimitTraceName(name: string): boolean {
  return name.endsWith('_DepthLimit')
}

export interface TraceTreeLike {
  line: {
    name: string
  }
  children: readonly TraceTreeLike[]
}

export function getDepthLimitTraceNames(node: TraceTreeLike): string[] {
  const events = isDepthLimitTraceName(node.line.name) ? [node.line.name] : []
  for (const child of node.children) {
    for (const event of getDepthLimitTraceNames(child)) {
      if (!events.includes(event))
        events.push(event)
    }
  }
  return events
}
