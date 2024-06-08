import { performance } from 'node:perf_hooks'

import type {
  BuilderProgram,
  CompilerHost,
  CompilerOptions,
  CreateProgramOptions,
  Diagnostic,
  DiagnosticReporter,
  ExtendedConfigCacheEntry,
  ParseConfigFileHost,
  ParsedCommandLine,
  PrinterOptions,
  Program,
  System,
  Type,
} from 'typescript'
import {
  JSDocParsingMode,
  NewLineKind,
  combinePaths,
  createGetCanonicalFileName,
  createGetSourceFile,
  createProgram,
  createWriteFileMeasuringIO,
  emitFilesAndReportErrorsAndGetExitStatus,
  findConfigFile,
  getConfigFileParsingDiagnostics,
  getDefaultLibFileName,
  getDirectoryPath,
  getParsedCommandLineOfConfigFile,
  maybeBind,
  memoize,
  startTracing,
  sys,
  tracing,
} from 'typescript'

export type ExecuteCommandLineCallbacks = (
  program: Program | BuilderProgram | ParsedCommandLine
) => void

let program: Program | undefined
export function getProgram() {
  return program
}

let lastTreeId = 0
const typeDictionary = new Map<number, Type>()
export interface Tree {
  id: number
  parent: Tree | undefined
  line: any
  children: Tree[]
  typeIds: number[]
}
export const treeRoot: Tree = {
  id: lastTreeId++,
  parent: undefined,
  line: { name: 'root', ts: performance.now() },
  children: [],
  typeIds: [],
}
let tree = treeRoot

export function printTree() {
  console.log(
    JSON.stringify(tree, (k, v) => (k === 'parent' ? undefined : v), 2),
  )
}

export function getTypeDictionary() {
  return typeDictionary
}

// TODO: see src/compiler/path.ts:632
function normalizePath(path: string) {
  return path
}

export function runLiveTrace(projectDirectory: string, traceDir: string) {
  const searchPath = normalizePath(projectDirectory)
  const configFileName = findConfigFile(searchPath, fileName =>
    sys.fileExists(fileName))
  const reportDiagnostic = (_diagnostic: Diagnostic) => {
    console.log(`${_diagnostic.messageText}`)
  }

  if (configFileName) {
    const extendedConfigCache = new Map<string, ExtendedConfigCacheEntry>()
    const configParseResult = getParsedCommandLineOfConfigFile(
      configFileName,
      {},
      sys as unknown as ParseConfigFileHost,
      extendedConfigCache,
      {},
    )
    if (!configParseResult)
      throw new Error('undefined configParseResult')
      // const configParseResult = parseConfigFileWithSystem(configFileName, commandLineOptions, extendedConfigCache, commandLine.watchOptions, sys, reportDiagnostic)! // TODO: GH#18217

    program = performCompilation(
      sys,
      reportDiagnostic,
      configParseResult,
      traceDir,
    )

    // writeTypeTimestamps(typeTimestamps);
    return program
  }
}

const defaultJSDocParsingMode = JSDocParsingMode.ParseForTypeErrors

function performCompilation(
  sys: System,
  reportDiagnostic: DiagnosticReporter,
  config: ParsedCommandLine,
  traceDir: string,
) {
  const { fileNames, options, projectReferences } = config
  options.generateTrace = traceDir
  const host = createCompilerHostWorker(
    options,
    /* setParentNodes */ undefined,
    sys,
  )
  host.jsDocParsingMode = defaultJSDocParsingMode
  //   const currentDirectory = host.getCurrentDirectory()
  //   const getCanonicalFileName = createGetCanonicalFileName(host.useCaseSensitiveFileNames())
  //   changeCompilerHostLikeToUseCache(host, fileName => toPath(fileName, currentDirectory, getCanonicalFileName))
  enableTracing(sys, options, /* isBuildMode */ false)

  config.options.noEmit = true

  const programOptions: CreateProgramOptions = {
    rootNames: fileNames,
    options,
    projectReferences,
    host,
    configFileParsingDiagnostics: getConfigFileParsingDiagnostics(config),
  }
  const program = createProgram(programOptions)
  emitFilesAndReportErrorsAndGetExitStatus(
    program,
    reportDiagnostic,
    s => sys.write(s + sys.newLine),
    (a, b) => {
      if (b) {
        b.forEach((c) => {
          //  console.log(`error at: ${c?.fileName}: ${c?.line}`);
        })
      }
    }, // createReportErrorSummary(sys, options),
  )

  tracing?.stopTracing()
  return program
}

export function createCompilerHostWorker(
  options: CompilerOptions,
  setParentNodes?: boolean,
  system: System = sys,
): CompilerHost {
  const existingDirectories = new Map<string, boolean>()
  const getCanonicalFileName = createGetCanonicalFileName(
    system.useCaseSensitiveFileNames,
  )
  function directoryExists(directoryPath: string): boolean {
    if (existingDirectories.has(directoryPath)) {
      return true
    }
    if ((sys.directoryExists || system.directoryExists)(directoryPath)) {
      existingDirectories.set(directoryPath, true)
      return true
    }
    return false
  }

  function getDefaultLibLocation(): string {
    return getDirectoryPath(normalizePath(system.getExecutingFilePath()))
  }

  const newLine = getNewLineCharacter(options)
  const realpath
      = system.realpath && ((path: string) => system.realpath!(path))
  const compilerHost: CompilerHost = {
    getSourceFile: createGetSourceFile(
      fileName => compilerHost.readFile(fileName),
      () => options,
      setParentNodes,
    ),
    getDefaultLibLocation,
    getDefaultLibFileName: options =>
      combinePaths(getDefaultLibLocation(), getDefaultLibFileName(options)),
    writeFile: createWriteFileMeasuringIO(
      (path, data, writeByteOrderMark) =>
        system.writeFile(path, data, writeByteOrderMark),
      path =>
        (compilerHost.createDirectory || system.createDirectory)(path),
      path => directoryExists(path),
    ),
    getCurrentDirectory: memoize(() => system.getCurrentDirectory()),
    useCaseSensitiveFileNames: () => system.useCaseSensitiveFileNames,
    getCanonicalFileName,
    getNewLine: () => newLine,
    fileExists: fileName => system.fileExists(fileName),
    readFile: fileName => system.readFile(fileName),
    trace: (s: string) => system.write(s + newLine),
    directoryExists: directoryName => system.directoryExists(directoryName),
    getEnvironmentVariable: name =>
      system.getEnvironmentVariable
        ? system.getEnvironmentVariable(name)
        : '',
    getDirectories: (path: string) => system.getDirectories(path),
    realpath,
    readDirectory: (path, extensions, include, exclude, depth) =>
      system.readDirectory(path, extensions, include, exclude, depth),
    createDirectory: d => system.createDirectory(d),
    createHash: maybeBind(system, system.createHash),
  }
  return compilerHost
}

const carriageReturnLineFeed = '\r\n'
const lineFeed = '\n'
export function getNewLineCharacter(
  options: CompilerOptions | PrinterOptions,
): string {
  switch (options.newLine) {
    case NewLineKind.CarriageReturnLineFeed:
      return carriageReturnLineFeed
    case NewLineKind.LineFeed:
    case undefined:
      return lineFeed
  }
}

function canTrace(system: System, compilerOptions: CompilerOptions) {
  return system === sys && compilerOptions.generateTrace
}

// TODO: do not call the held record type and just fetch the types by id from the program as needed
function enableTracing(
  system: System,
  compilerOptions: CompilerOptions,
  isBuildMode: boolean,
) {
  if (canTrace(system, compilerOptions)) {
    typeDictionary.clear()

    startTracing(
      isBuildMode ? 'build' : 'project',
      compilerOptions.generateTrace!,
      compilerOptions.configFilePath,
    )
    if (tracing) {
      const holdRecordType = tracing.recordType
      tracing.recordType = (type: Type) => {
        // typeTimestamps.set(type.id, 1000 * timestamp());
        if (typeDictionary.size === 0)
          holdRecordType(type) // need one or ts crashes
        typeDictionary.set(type.id, type)
        tree.typeIds.push(type.id)
      }

      tracing.instant = (phase: string, name: string, args?: object) => {
        tree.children.push({
          id: lastTreeId++,
          parent: tree,
          line: {
            phase,
            name,
            args,
            ts: performance.now(),
          },
          children: [],
          typeIds: [],
        })
      }

      tracing.push = (
        phase: string,
        name: string,
        args?: object,
        separateBeginAndEnd = false,
      ) => {
        const child: Tree = {
          id: lastTreeId++,
          parent: tree,
          line: { phase, name, args, ts: performance.now() },
          children: [],
          typeIds: [],
        }
        tree.children.push(child)
        tree = child
      }

      tracing.pop = (results?: object) => {
        if (!tree.parent) {
          throw new Error('Tree over popped')
        }
        tree = tree.parent
        tree.line.results = results ?? {}
        tree.line.dur = performance.now() - tree.line.ts
      }
    }
  }
}
