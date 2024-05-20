import { readFileSync, writeFileSync } from 'node:fs'
import type { configKeys } from '../src/constants'
import { extPrefix } from '../src/constants'

type WithPrefix<T extends readonly [string, ...string[]]> = { [k in keyof T]: `${typeof extPrefix}.${T[k]}` }
type PropertyConfigKey = WithPrefix<typeof configKeys>[number]

interface Command {
  command: `${typeof extPrefix}.${string}`
  title: string
  category?: `Tracer${string}`
  icon?: any
  when?: {
    pallete?: string
    explorerContext?: string
  }
}

const commands: Command[] = [
  {
    command: 'tsperf.tracer.gotoTracePosition',
    title: 'Goto position in trace',
  },
  {
    command: 'tsperf.tracer.openInBrowser',
    title: 'Open trace viewer',
    icon: {
      dark: 'resources/todo.svg',
      light: 'resources/todo.svg',
    },
  },
  {
    command: 'tsperf.tracer.runTrace',
    title: 'tsc trace',
    icon: {
      dark: 'resources/todo.svg',
      light: 'resources/todo.svg',
    },
  },
  {
    command: 'tsperf.tracer.sendTrace',
    title: 'Send Trace to Trace Viewer',
    when: {
      pallete: '!notebookEditorFocused && editorLangId == \'json\'',
      explorerContext: 'resourceFilename =~ /.*((trace)|(types)).*\.json/',
    },
  },
]

function commandEntry(command: Command) {
  const entry = { ...command, category: 'Tracer' }
  delete entry.when
  return entry
}

function menuEntries(menu: keyof Required<Command>['when']): (Exclude<Command, 'when'> & { when: string })[] {
  return commands.filter(x => x.when && x.when[menu]).map((command) => {
    const entry = { ...command, category: 'Tracer', when: command.when![menu]! } as const
    return entry
  })
}

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

pkg.contributes = {
  configuration: {
    title: extPrefix,
    properties: {
      'tsperf.tracer.typescriptPathMode': {
        type: 'string',
        default: 'vscode-builtin',
        description: 'Use TypeScript from',
        enum: [
          'vscode-builtin',
          'tsdk',
          'workspace',
          'explicit',
        ],
        enumDescriptions: [
          'VsCode\'s built in TypeScript',
          'VsCode TSDK setting',
          'node_modules in you project',
          'Use tracer TypeScript path setting',
        ],
      },
      'tsperf.tracer.traceCmd': {
        type: 'string',
        // eslint-disable-next-line no-template-curly-in-string
        default: 'npx tsc --generateTrace ${traceDir}',
        description: 'command to generate tsc traces',
      },
      'tsperf.tracer.typescriptPath': {
        type: 'string',
        default: '',
        description: 'Path to TypeScript. Must be specified if \'Use TypeScript from\' is \'Use tracer TypeScript path setting\'',
      },
      'tsperf.tracer.benchmarkIterations': {
        type: 'number',
        default: 3,
        description: 'Higher values reduce variance but increase benchmarking time',
      },
      'tsperf.tracer.restartTsserverOnIteration': {
        type: 'boolean',
        default: false,
        description: 'Restart tsserver on each iteration to avoid caching influincing measurements',
      },
      'tsperf.tracer.allIdentifiers': {
        type: 'boolean',
        default: false,
        description: 'Benchmark all allIdentifiers or only the first of each statement',
      },
    } satisfies Record<PropertyConfigKey, any>,
  },
  commands: commands.map(commandEntry),
  menus: {
    'commandPalette': menuEntries('pallete'),
    'explorer/context': menuEntries('explorerContext'),
  },
}

const outStr = JSON.stringify(pkg, null, 2)

writeFileSync('./package.json', `${outStr}\n`)
