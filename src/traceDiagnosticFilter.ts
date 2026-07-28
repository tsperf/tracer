import * as ts from 'typescript'

const declarationFilePattern = /\.d\.(?:cts|mts|ts)$/i

export function shouldSuppressTraceDiagnostic(fileName: string, sourceText: string, position: number): boolean {
  return createTraceDiagnosticFilter(fileName, sourceText)(position)
}

export function createTraceDiagnosticFilter(fileName: string, sourceText: string) {
  if (declarationFilePattern.test(fileName))
    return () => true

  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true)
  return (position: number) => {
    const node = findNodeAtPosition(sourceFile, position)

    for (let current = node; current; current = current.parent) {
      if (ts.isTypeAliasDeclaration(current) || ts.isInterfaceDeclaration(current))
        return true
    }

    return false
  }
}

function findNodeAtPosition(node: ts.Node, position: number): ts.Node | undefined {
  if (position < node.getStart() || position >= node.getEnd())
    return undefined

  const child = ts.forEachChild(node, current => findNodeAtPosition(current, position))
  return child ?? node
}
