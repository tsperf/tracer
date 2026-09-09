const testFileExtensions = ['.ts', '.tsx', '.mts', '.cts'] as const
const declarationFilePattern = /\.d\.(?:cts|mts|ts)$/i

export function getTestFileNames(fileNames: readonly string[]) {
  return fileNames.filter(name =>
    testFileExtensions.some(ext => name.endsWith(ext))
    && !declarationFilePattern.test(name),
  )
}
