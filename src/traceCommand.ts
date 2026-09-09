import { extname, relative } from 'node:path'

export function traceSaveNameForFile(workspacePath: string, filePath: string): string {
  const relativeFile = relative(workspacePath, filePath)
  const extension = extname(relativeFile)
  return extension ? relativeFile.slice(0, -extension.length) : relativeFile
}
