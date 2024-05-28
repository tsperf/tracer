import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { type CommandId, type ConfigKey, configKeys } from '../src/constants'
import { extPrefix } from '../src/constants'

type WithPrefix<T extends ConfigKey> = `${typeof extPrefix}.${T}`
type PropertyConfigKey = WithPrefix<ConfigKey>

interface Command {
  title: string
  category?: `Tracer${string}`
  icon?: any
  when?: {
    pallete?: string
    explorerContext?: string
  }
}

const configDescriptions: Record<string, string> = {}
for (const configKey of configKeys) {
  try {
    const md = readFileSync(join(__dirname, 'configDescriptions', `${configKey}.md`)).toString()
    configDescriptions[configKey] = md
  }
  catch (_e) {
    /* ignore file errors */
  }
}

const commandRecord: Record<CommandId, Command> = {
  'tsperf.tracer.gotoTracePosition': {
    title: 'Goto position in trace',
  },
  'tsperf.tracer.openInBrowser': {
    title: 'Open trace viewer',
    icon: {
      dark: 'resources/todo.svg',
      light: 'resources/todo.svg',
    },
  },
  'tsperf.tracer.runTrace': {
    title: 'tsc trace',
    icon: {
      dark: 'resources/todo.svg',
      light: 'resources/todo.svg',
    },
  },
  'tsperf.tracer.sendTrace': {
    title: 'Send Trace to Trace Viewer',
    when: {
      pallete: '!notebookEditorFocused && editorLangId == \'json\'',
      explorerContext: 'resourceFilename =~ /.*((trace)|(types)).*\.json/',
    },
  },
  'tsperf.tracer.openTerminal': {
    title: 'Open tracer directory in terminal',
  },
}

const commands = Object.entries(commandRecord).map(([command, record]) => ({ ...record, command }))

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

function threshold() {
  return {
    type: 'object',
    properties: {
      info: {
        type: 'number',
      },
      warning: {
        type: 'number',
      },
      error: {
        type: 'number',
      },
    },
    required: ['info', 'warning', 'error'],
    additionalProperties: false,
    default: { info: 1, warning: -1, error: -1 },
    description: 'todo',
  }
}

const orderedConfigurationProperties: Partial<Record<PropertyConfigKey, Record<string, any>>>[] = [
  {
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
  },
  {
    'tsperf.tracer.traceCmd': {
      type: 'string',
      // eslint-disable-next-line no-template-curly-in-string
      default: 'npx tsc --noEmit --generateTrace ${traceDir}',
      description: 'command to generate tsc traces',
    },
  },
  {
    'tsperf.tracer.typescriptPath': {
      type: 'string',
      default: '',
      description: 'Path to TypeScript. Must be specified if \'Use TypeScript from\' is \'Use tracer TypeScript path setting\'',
    },
  },
  {
    'tsperf.tracer.benchmarkIterations': {
      type: 'number',
      default: 3,
      description: 'Higher values reduce variance but increase benchmarking time',
    },
  },
  {
    'tsperf.tracer.restartTsserverOnIteration': {
      type: 'boolean',
      default: false,
      description: 'Restart tsserver on each iteration to avoid caching influincing measurements',
    },
  },
  {
    'tsperf.tracer.allIdentifiers': {
      type: 'boolean',
      default: false,
      description: 'Benchmark all allIdentifiers or only the first of each statement',
    },
  },
  {
    'tsperf.tracer.enableTraceMetrics': {
      type: 'boolean',
      default: true,
      description: 'Create diagnostics from trace data',
    },
  },
  {
    'tsperf.tracer.traceTimeThresholds': threshold(),
  },
  {
    'tsperf.tracer.traceTypeThresholds': threshold(),
  },
  {
    'tsperf.tracer.traceTotalTypeThresholds': threshold(),
  },
  {
    'tsperf.tracer.traceDiagnosticsRelative': {
      type: 'boolean',
      default: false,
      description: 'Use measurements relative to the average for trace diagnostics',
    },
  },
  {
    'tsperf.tracer.traceTimeRelativeThresholds': threshold(),
  },
  {
    'tsperf.tracer.traceTypeRelativeThresholds': threshold(),
  },
  {
    'tsperf.tracer.traceTotalTypeRelativeThresholds': threshold(),
  },
]

const configurationProperties = orderedConfigurationProperties
  .map((x, idx) => {
    // (x as any).order = idx
    for (const propertyKey in x) {
      const property = x[propertyKey as PropertyConfigKey]!
      property.order = idx
      const configKey = propertyKey.replace(`${extPrefix}.`, '')
      if (configKey in configDescriptions)
        property.markdownDescription = configDescriptions[configKey]
    }
    return x
  }).reduce((a, b) => ({ ...a, ...b }), {})

pkg.contributes = {
  configuration: {
    title: 'TsPerf Tracer',
    properties: configurationProperties,
  },
  commands: commands.map(commandEntry),
  menus: {
    'commandPalette': menuEntries('pallete'),
    'explorer/context': menuEntries('explorerContext'),
  },
}

const outStr = JSON.stringify(pkg, null, 2)

writeFileSync('./package.json', `${outStr}\n`)
