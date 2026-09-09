import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

export function getTraceFilesToDelete(dirName: string, fileName: string): string[] {
  if (fileName === '*') {
    return readdirSync(dirName)
      .map(file => join(dirName, file))
      .filter(filePath => statSync(filePath).isFile() && filePath.endsWith('.json'))
  }

  if (fileName.endsWith('.json'))
    return [join(dirName, fileName)]

  return []
}
