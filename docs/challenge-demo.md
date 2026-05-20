# TSPerf Challenge Demo

This is a short demo path for showing that Type Complexity Tracer now reports TypeScript type complexity and time-to-load evidence from repeatable trace runs.

## Setup

1. Open a TypeScript workspace in VS Code.
2. Install dependencies in this extension repo with `pnpm install`.
3. Run `pnpm build`.
4. Start the extension in an Extension Development Host.

## Demo Flow

1. Run `Tracer: tsc trace` against the workspace.
2. Open the generated trace directory and show `metrics.json`.
3. Highlight these fields:
   - `wallTimeMs`
   - `exitCode`
   - `traceJsonFiles`
   - `parse.status`
   - `extendedDiagnostics.types`
   - `extendedDiagnostics.instantiations`
   - `extendedDiagnostics.checkTimeMs`
   - `extendedDiagnostics.totalTimeMs`
4. Open the trace viewer and inspect the trace tree.
5. Use `Tracer: Trace current file` from a TypeScript source file to create a focused run with a predictable workspace-relative save name.
6. Run a second trace after changing a type-heavy code path.
7. Run `Tracer: Compare trace metrics`, select the baseline and comparison `metrics.json` files, and show the generated Markdown report.

For example artifact shapes, see [challenge-evidence.md](./challenge-evidence.md).

## Submission Angle

The branch demonstrates a complete measurement loop:

- run a TypeScript compiler trace from VS Code
- record a portable `metrics.json` artifact
- tolerate stock TypeScript trace output
- parse `--extendedDiagnostics` counters
- inspect trace tree details in the UI
- compare before/after runs in a readable report

That maps to the challenge requirement for a VS Code plugin that shows TypeScript type complexity and load-time cost.
