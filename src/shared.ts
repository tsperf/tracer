import * as os from 'node:os'
import process from 'node:process'
import path from 'node:path'

import * as vscode from 'vscode'
import type { FormatDiagnosticsHost } from 'typescript'

import { log } from './logger'

export async function getTsconfigFile(path: string) {
  let files = await vscode.workspace.findFiles('**/tsconfig.json', '**​/node_modules/**')
  files = files.sort((a, b) => b.fsPath.length - a.fsPath.length)
    .filter(p => !p.fsPath.includes('node_modules'))

  log({ path, files })

  const pathSegments = path.split('/')
  for (let i = pathSegments.length; i > 0; i--) {
    const path = pathSegments.slice(0, i).join('/')
    const tsConfigFile = files.find(file => file.fsPath.startsWith(path))
    if (tsConfigFile)
      return tsConfigFile
  }

  return files[0]
}

const formatDiagnosticsHost: FormatDiagnosticsHost = {
  getCanonicalFileName: fileName => fileName,
  getNewLine: () => os.EOL,
  getCurrentDirectory: () => process.cwd(),
}

export async function getParsedCommandLine(filename: string) {
  const tsPath = path.join(path.dirname(vscode.extensions.getExtension('vscode.typescript-language-features')!.extensionPath), 'node_modules/typescript')
  // eslint-disable-next-line ts/no-require-imports, ts/no-var-requires
  const ts = require(tsPath) as typeof import('typescript')
  const tsConfigFile = await getTsconfigFile(filename)
  const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
    tsConfigFile.fsPath,
    {},
    {
      fileExists: ts.sys.fileExists,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      readDirectory: ts.sys.readDirectory,
      readFile: ts.sys.readFile,
      useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        log(ts.formatDiagnostic(diagnostic, formatDiagnosticsHost))
      },
    },
  )!
  return parsedCommandLine
}
