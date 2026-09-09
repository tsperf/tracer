# Type Complexity Tracer

<a href="https://marketplace.visualstudio.com/items?itemName=tsperf.tracer" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/tsperf.tracer.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

> A VSCode extension to measure type complexity within a project.

🚧 It is a work in progress - help is wanted! 🚧

## Real-time type checking estimates

To avoid the overhead of launching a separate tsserver, it currently queries the VSCode language server to get information about tokens in an open file, and uses the timings of the responses as a proxy for the complexity of the types, following the pattern of [`@definitelytyped/perf`](https://github.com/microsoft/DefinitelyTyped-tools/blob/41ba894ba571e55fa91ef0bb0d44d6eb6d201943/packages/perf).

## Trace file view and metrics

The `Tracer: tsc trace` command can be run to gather accurate timings.  As with real-time metrics, these create diagnostics in the editor open files. It also opens an interface to browse trace files. Editor and UI commands enable navigating between locations in the editor and the trace.

Each trace run writes a `metrics.json` file next to the generated trace files. The artifact records the command, working directory, trace directory, start/end time, wall time, exit code, output summaries, discovered trace JSON files, parse status, and any parsed `--extendedDiagnostics` counters. This makes traces easier to compare across branches and machines without reopening the full trace viewer.

Type count metrics are displayed when a timestamped `types.json` file is available. Stock TypeScript `types.json` files are also parsed safely, so a normal `npx tsc --generateTrace` run still reports the total type count even when per-span type attribution is unavailable.

### Focused traces and comparisons

- `Tracer: Trace current file` runs the configured trace command from the active TypeScript file context and saves the run under a workspace-relative trace name.
- `Tracer: Compare trace metrics` opens two `metrics.json` files and renders a Markdown before/after report for wall time, exit code, trace file coverage, parse status, compiler diagnostics, and output deltas.
- `Tracer: Open trace viewer` remains the main path for inspecting trace trees and jumping from expensive spans back to source.

For a short reproducible demo path, see [docs/challenge-demo.md](./docs/challenge-demo.md). For artifact examples, see [docs/challenge-evidence.md](./docs/challenge-evidence.md). For challenge review and submission packaging, see [docs/tsperf-submission.md](./docs/tsperf-submission.md).

### Use in mono repos

Better support for mono repos is on the roadmap. For now you can run traces for packages via the context menu in the file tree

## Credits

We are grateful to [Algora](https://console.algora.io/) for creating the [TSPerf Type Challenge](https://console.algora.io/challenges/tsperf) and to its sponsors.

## Help wanted

- Improve UX/API of the plugin - for example, more settings to customise how data is displayed to the user and better display of the traces
- Investigate persistent worker threads that watch changes in a project and update asynchronously (and do not need to reinitialise TypeScript)
- See if it is possible to get extended diagnostics or other diagnostic data from the compiler or tsserver APIs

## License

Published under the [MIT License](./LICENCE).
