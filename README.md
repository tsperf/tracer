# Type Complexity Tracer

<a href="https://marketplace.visualstudio.com/items?itemName=tsperf.tracer" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/tsperf.tracer.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

> A VSCode extension to measure type complexity within a project.

🚧 It is a work in progress - help is wanted! 🚧

## How it works

To avoid the overhead of launching a separate tsserver, it currently queries the VSCode language server to get information about every token in an open file, and uses the timings of the responses as a proxy for the complexity of the types, following the pattern of [`@definitelytyped/perf`](https://github.com/microsoft/DefinitelyTyped-tools/blob/41ba894ba571e55fa91ef0bb0d44d6eb6d201943/packages/perf).

## Help wanted

- Improve UX/API of the plugin - for example, add settings to disable/customise how data is displayed to the user
- Investigate the possibility of running a TypeScript trace and consuming this data (which would be much more reliable but might take longer)
- Investigate persistent worker threads that watch changes in a project and update asynchronously (and do not need to reinitialise TypeScript)
- See if it is possible to get extended diagnostics or other diagnostic data from the compiler or tsserver APIs

## License

[MIT](./LICENSE) License © 2024 [Aleksandra Sikora](https://github.com/beerose) and [Daniel Roe](https://github.com/danielroe)
