# Type Complexity Tracer

<a href="https://marketplace.visualstudio.com/items?itemName=tsperf.tracer" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/tsperf.tracer.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

> A VSCode extension to measure type complexity within a project.

🚧 It is a work in progress - help is wanted! 🚧

## Realt ime type checking time estimates

To avoid the overhead of launching a separate tsserver, it currently queries the VSCode language server to get information about tokens in an open file, and uses the timings of the responses as a proxy for the complexity of the types, following the pattern of [`@definitelytyped/perf`](https://github.com/microsoft/DefinitelyTyped-tools/blob/41ba894ba571e55fa91ef0bb0d44d6eb6d201943/packages/perf).

## Trace file view and metrics

The `Tracer: tsc trace` command can be run to gather accurate timings.  As with the real time metrics these create diagnostics in the edtior open files. It also opens an interface to browse trace files. Editor and UI commands enable navigating between locations in the editor and the trace.

If the trace is run with a version of tsc that includes timestamps in types.json, type count metrics are also displayed. A PR to include these timestamps or tooling to automatically patch them in are works in progress.  See https://github.com/typeholes/TypeScript/tree/trace-data-5-4 for a version you can build yourself.

## Help wanted

- Improve UX/API of the plugin - for example, more settings to customise how data is displayed to the user and better display of the traces
- Investigate persistent worker threads that watch changes in a project and update asynchronously (and do not need to reinitialise TypeScript)
- See if it is possible to get extended diagnostics or other diagnostic data from the compiler or tsserver APIs

## License

[MIT](./LICENSE) License © 2024 [Aleksandra Sikora](https://github.com/beerose), [Daniel Roe](https://github.com/danielroe), and [Larry Layland](https://github.com/typeholes)
