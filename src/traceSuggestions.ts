import type { TraceSuggestion } from '../shared/src/messages'
import type { Tree } from './traceTree'

function pushSuggestion(suggestions: TraceSuggestion[], seen: Set<string>, suggestion: TraceSuggestion) {
  const key = `${suggestion.kind}:${suggestion.fileName ?? ''}:${suggestion.pos ?? -1}:${suggestion.title}`
  if (seen.has(key))
    return
  seen.add(key)
  suggestions.push(suggestion)
}

function sourceLocation(node: Tree) {
  return {
    fileName: node.line.args?.path,
    pos: node.line.args?.pos,
  }
}

export function getTraceSuggestions(tree: Tree): TraceSuggestion[] {
  const suggestions: TraceSuggestion[] = []
  const seen = new Set<string>()

  function add(node: Tree, kind: string, severity: TraceSuggestion['severity'], title: string, detail: string) {
    const { fileName, pos } = sourceLocation(node)
    pushSuggestion(suggestions, seen, {
      kind,
      severity,
      title,
      detail,
      fileName,
      pos,
      traceName: node.line.name,
      nodeId: node.id,
    })
  }

  function visit(node: Tree) {
    if (node.id !== 0) {
      const name = node.line.name
      const dur = node.line.dur ?? 0
      const totalTypes = node.typeCnt + node.childTypeCnt
      const argKeys = node.line.args ? Object.keys(node.line.args as Record<string, unknown>) : []

      if (name.includes('DepthLimit')) {
        add(
          node,
          'depth-limit',
          'warning',
          'TypeScript hit a depth limit',
          'This trace shows a depth-limit event. The type graph likely contains recursion or a self-referential alias; simplify the recursive edge or break the cycle if possible.',
        )
      }

      if ((name === 'structuredTypeRelatedTo' || name === 'typeArgumentsRelatedTo' || name === 'isRelatedTo') && dur >= 10_000) {
        add(
          node,
          'expensive-relation',
          'warning',
          'Expensive type relation check',
          'This relation took a long time. If the value does not need contextual typing, try simplifying the union or replacing the contextual position with `satisfies`.',
        )
      }

      if (dur >= 50_000 && totalTypes >= 50) {
        add(
          node,
          'hot-file',
          'info',
          'This location is a hot spot',
          'The trace shows high duration with lots of type work nearby. Try reducing generic fan-out, splitting a large type alias, or narrowing the local expression.',
        )
      }

      if (name.startsWith('check') && totalTypes >= 100 && argKeys.includes('path')) {
        add(
          node,
          'dense-check',
          'info',
          'This file is driving lots of type work',
          'A file-level check produced a lot of type activity. Consider whether the file can be split, simplified, or given a narrower public type surface.',
        )
      }
    }

    node.children.forEach(visit)
  }

  visit(tree)
  return suggestions
}
