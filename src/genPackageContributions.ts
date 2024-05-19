export const extPrefix = 'tsperf.tracer'

export const configKeys = [
  'typescriptPath',
  'typescriptPathMode',
  'benchmarkIterations',
  'restartTsserverOnIteration',
  'allIdentifiers',
  'traceCmd',
] as const
export type ConfigKey = typeof configKeys[number]

type WithPrefix<T extends readonly [string, ...string[]]> = { [k in keyof T]: `${typeof extPrefix}.${T[k]}` }
type ProperyConfigKey = WithPrefix<typeof configKeys>[number]

interface Command {
  command: `${typeof extPrefix}.${string}`
  title: string
  category: `Tracer${string}`
  icon?: any
  when?: string
}

export const contributesForPackageJson = { contributes: {
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
    } satisfies Record<ProperyConfigKey, any>,
  },
  commandPalette: [
    {
      command: 'tsperf.tracer.sendTrace',
      when: '!notebookEditorFocused && editorLangId == \'json\'',
      group: 'tracer',
    },
  ],
  commands: [
    {
      command: 'tsperf.tracer.gotoTracePosition',
      title: 'Goto position in trace',
      category: 'Tracer',
    },
    {
      command: 'tsperf.tracer.openInBrowser',
      title: 'Open trace view in browser',
      category: 'Tracer',
      icon: {
        dark: 'resources/todo.svg',
        light: 'resources/todo.svg',
      },
    },
    {
      command: 'tsperf.tracer.runTrace',
      title: 'tsc trace',
      category: 'Tracer',
      icon: {
        dark: 'resources/todo.svg',
        light: 'resources/todo.svg',
      },
    },
    {
      command: 'tsperf.tracer.sendTrace',
      title: 'Send Trace to Trace Viewer',
      when: '!notebookEditorFocused && editorLangId == \'json\'',
      category: 'Tracer',
    },
  ] satisfies Command[],
},
}
