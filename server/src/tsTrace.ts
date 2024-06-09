/* eslint-disable no-console */
import { performance } from 'node:perf_hooks'

import type {
  BuilderProgram,
  CompilerHost,
  CompilerOptions,
  ConditionalType,
  CreateProgramOptions,
  Diagnostic,
  DiagnosticReporter,
  EvolvingArrayType,
  ExtendedConfigCacheEntry,
  IndexType,
  IndexedAccessType,
  IntersectionType,
  LineAndCharacter,
  Node,
  ParseConfigFileHost,
  ParsedCommandLine,
  PrinterOptions,
  Program,
  ReverseMappedType,
  SubstitutionType,
  System,
  Type,
  TypeReference,
  UnionType,
} from 'typescript'
import {
  Debug,
  JSDocParsingMode,
  NewLineKind,
  ObjectFlags,
  TypeFlags,
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
  getLineAndCharacterOfPosition,
  getParsedCommandLineOfConfigFile,
  getSourceFileOfNode,
  maybeBind,
  memoize,
  startTracing,
  sys,
  tracing,
  unescapeLeadingUnderscores,
} from 'typescript'

import type { Tree } from '../../shared/src/tree'

export type { Tree } from '../../shared/src/tree'

export type ExecuteCommandLineCallbacks = (
  program: Program | BuilderProgram | ParsedCommandLine
) => void

let program: Program | undefined
export function getProgram() {
  return program
}

// let getExistingSourceFile(fileName: string)

export const treeIdNodes = new Map<number, Tree>()

let lastTreeId = 0
const typeDictionary = new Map<number, Type>()
export const treeRoot: Tree = {
  id: lastTreeId++,
  parentId: -1,
  line: { pid: 1, tid: 1, ph: 'root', cat: 'root', ts: performance.now(), name: 'root', dur: 0 },
  children: [],
  typeIds: [],
  childCnt: 0,
  childTypeCnt: 0,
  maxDepth: 0,
  typeCnt: 0,

}
let tree = { ...treeRoot }
treeIdNodes.set(0, treeRoot)

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

    tree.line.dur = performance.now() - tree.line.ts
    treeIdNodes.set(tree.id, tree)

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
          console.log(`error at: ${c?.fileName}: ${c?.line}`)
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
    tree = { ...treeRoot }

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
        tree.typeCnt = tree.typeIds.push(type.id)
      }

      tracing.instant = (phase: string, name: string, args?: Record<string, any>) => {
        addLocation(args)

        const node: Tree = {
          id: lastTreeId++,
          parentId: tree.id,
          line: {
            pid: 1,
            tid: 1,
            cat: phase,
            ph: 'x',
            name,
            args,
            ts: performance.now(),
          },
          children: [],
          typeIds: [],
          childCnt: 0,
          childTypeCnt: 0,
          maxDepth: 0,
          typeCnt: 0,
        }
        tree.childCnt = tree.children.push(node)
        treeIdNodes.set(node.id, node)
      }

      tracing.push = (
        phase: string,
        name: string,
        args?: object,
        _separateBeginAndEnd = false,
      ) => {
        addLocation(args)
        const child: Tree = {
          id: lastTreeId++,
          parentId: tree.id,
          line: {
            pid: 1,
            tid: 1,
            cat: phase,
            ph: 'x',
            name,
            args,
            ts: performance.now(),
          },
          children: [],
          typeIds: [],
          childCnt: 0,
          childTypeCnt: 0,
          maxDepth: 0,
          typeCnt: 0,
        }
        tree.children.push(child)
        tree = child
        treeIdNodes.set(child.id, child)
      }

      tracing.pop = (results?: object) => {
        if (tree.parentId === -1) {
          throw new Error('Tree over popped')
        }
        const parent = treeIdNodes.get(tree.parentId)!
        parent.maxDepth = Math.max(parent.maxDepth, tree.maxDepth + 1)
        parent.childTypeCnt += tree.typeCnt
        tree = parent
        tree.line.results = results ?? {}
        tree.line.dur = performance.now() - tree.line.ts
      }
    }
  }
}

// TODO: we may want to make this on demand, or only populate commonly used properties eagerly

const recursionIdentityMap = new Map<object, number>()
function addLocation(args: Record<string, any> | undefined) {
  if (args) {
    args.location = (args && 'path' in args && 'pos' in args && typeof args.path === 'string' && typeof args.pos === 'number')
      ? posToLocation(args.path, args.pos)
      : undefined
  }
}

// ripped straight from the ts repo in tracing.ts dumpTypes
export function typeToDescriptor(type: Type) {
  const objectFlags = (type as any).objectFlags
  const symbol = type.aliasSymbol ?? type.symbol

  // It's slow to compute the display text, so skip it unless it's really valuable (or cheap)
  let display: string | undefined
  if ((objectFlags & ObjectFlags.Anonymous) | (type.flags & TypeFlags.Literal)) {
    try {
      display = type.checker?.typeToString(type)
    }
    catch {
      display = undefined
    }
  }

  let indexedAccessProperties: object = {}
  if (type.flags & TypeFlags.IndexedAccess) {
    const indexedAccessType = type as IndexedAccessType
    indexedAccessProperties = {
      indexedAccessObjectType: indexedAccessType.objectType?.id,
      indexedAccessIndexType: indexedAccessType.indexType?.id,
    }
  }

  let referenceProperties: object = {}
  if (objectFlags & ObjectFlags.Reference) {
    const referenceType = type as TypeReference
    referenceProperties = {
      instantiatedType: referenceType.target?.id,
      typeArguments: referenceType.resolvedTypeArguments?.map(t => t.id),
      referenceLocation: getLocation(referenceType.node),
    }
  }

  let conditionalProperties: object = {}
  if (type.flags & TypeFlags.Conditional) {
    const conditionalType = type as ConditionalType
    conditionalProperties = {
      conditionalCheckType: conditionalType.checkType?.id,
      conditionalExtendsType: conditionalType.extendsType?.id,
      conditionalTrueType: conditionalType.resolvedTrueType?.id ?? -1,
      conditionalFalseType: conditionalType.resolvedFalseType?.id ?? -1,
    }
  }

  let substitutionProperties: object = {}
  if (type.flags & TypeFlags.Substitution) {
    const substitutionType = type as SubstitutionType
    substitutionProperties = {
      substitutionBaseType: substitutionType.baseType?.id,
      constraintType: substitutionType.constraint?.id,
    }
  }

  let reverseMappedProperties: object = {}
  if (objectFlags & ObjectFlags.ReverseMapped) {
    const reverseMappedType = type as ReverseMappedType
    reverseMappedProperties = {
      reverseMappedSourceType: reverseMappedType.source?.id,
      reverseMappedMappedType: reverseMappedType.mappedType?.id,
      reverseMappedConstraintType: reverseMappedType.constraintType?.id,
    }
  }

  let evolvingArrayProperties: object = {}
  if (objectFlags & ObjectFlags.EvolvingArray) {
    const evolvingArrayType = type as EvolvingArrayType
    evolvingArrayProperties = {
      evolvingArrayElementType: evolvingArrayType.elementType.id,
      evolvingArrayFinalType: evolvingArrayType.finalArrayType?.id,
    }
  }

  // We can't print out an arbitrary object, so just assign each one a unique number.
  // Don't call it an "id" so people don't treat it as a type id.
  let recursionToken: number | undefined
  const recursionIdentity = type.checker.getRecursionIdentity(type)
  if (recursionIdentity) {
    recursionToken = recursionIdentityMap.get(recursionIdentity)
    if (!recursionToken) {
      recursionToken = recursionIdentityMap.size
      recursionIdentityMap.set(recursionIdentity, recursionToken)
    }
  }

  const descriptor = {
    id: type.id,
    intrinsicName: (type as any).intrinsicName,
    symbolName: symbol?.escapedName && unescapeLeadingUnderscores(symbol.escapedName),
    recursionId: recursionToken,
    isTuple: objectFlags & ObjectFlags.Tuple ? true : undefined,
    unionTypes: (type.flags & TypeFlags.Union) ? (type as UnionType).types?.map(t => t.id) : undefined,
    intersectionTypes: (type.flags & TypeFlags.Intersection) ? (type as IntersectionType).types.map(t => t.id) : undefined,
    aliasTypeArguments: type.aliasTypeArguments?.map(t => t.id),
    keyofType: (type.flags & TypeFlags.Index) ? (type as IndexType).type?.id : undefined,
    ...indexedAccessProperties,
    ...referenceProperties,
    ...conditionalProperties,
    ...substitutionProperties,
    ...reverseMappedProperties,
    ...evolvingArrayProperties,
    destructuringPattern: getLocation(type.pattern),
    firstDeclaration: getLocation(symbol?.declarations?.[0]),
    flags: Debug.formatTypeFlags(type.flags).split('|'),
    display,
  }
  return descriptor
}

// ripped from tracing.ts
function getLocation(node: Node | undefined) {
  const file = getSourceFileOfNode(node)
  return !file
    ? undefined
    : {
        path: file.path,
        start: indexFromOne(getLineAndCharacterOfPosition(file, node!.pos)),
        _end: indexFromOne(getLineAndCharacterOfPosition(file, node!.end)),
        get end() {
          return this._end
        },
        set end(value) {
          this._end = value
        },
      }
}

function indexFromOne(lc: LineAndCharacter): LineAndCharacter {
  return {
    line: lc.line + 1,
    character: lc.character + 1,
  }
}

export function posToLocation(filename: string, position: number) {
  const sourceFile = program?.getSourceFile(filename)
  if (sourceFile)
    return indexFromOne(getLineAndCharacterOfPosition(sourceFile, position))
}
