import * as os from 'node:os'
import process from 'node:process'

import * as vscode from 'vscode'
import type { FormatDiagnosticsHost } from 'typescript'
import ts from 'typescript'

import { log } from './logger'

export async function getTsconfigFile() {
  const [tsConfigFile] = await vscode.workspace.findFiles('**/tsconfig.json')
  return tsConfigFile
}

export async function getParsedCommandLine() {
  const tsConfigFile = await getTsconfigFile()
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

const formatDiagnosticsHost: FormatDiagnosticsHost = {
  getCanonicalFileName: fileName => fileName,
  getNewLine: () => os.EOL,
  getCurrentDirectory: () => process.cwd(),
}
