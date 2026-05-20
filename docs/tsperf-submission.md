# TSPerf Submission Package

This package summarizes the challenge-ready branch for Algora's TSPerf Type Challenge.

## Candidate

- Fork: https://github.com/jianmosier/tracer
- Branch: `codex/tsperf-team-stack`
- Challenge fit: VS Code extension support for measuring TypeScript type complexity and load-time cost from repeatable compiler traces.

## Reviewer Path

1. Install dependencies with `pnpm install`.
2. Run validation:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`
   - `pnpm exec vitest run`
3. Start the extension in an Extension Development Host.
4. Open a TypeScript workspace.
5. Run `Tracer: tsc trace`.
6. Inspect the generated `metrics.json` next to the trace output.
7. Run `Tracer: Trace current file` from a TypeScript editor to collect a focused run.
8. Run `Tracer: Compare trace metrics` on two `metrics.json` files and inspect the Markdown delta report.

## What To Evaluate

- `metrics.json` records trace command, cwd, trace directory, timestamps, wall time, exit code, output summaries, trace JSON discovery, parse status, and parsed `--extendedDiagnostics` counters.
- `docs/challenge-evidence.md` shows representative `metrics.json` and comparison-report output for quick review.
- Stock TypeScript `types.json` files are handled without requiring tracer-specific timestamp fields.
- Extended diagnostics expose high-signal type-system counters including `types`, `instantiations`, memory, parse time, bind time, check time, emit time, and total time.
- The comparison command turns two trace runs into a compact before/after report suitable for branch, commit, or code-path comparisons.
- The focused current-file trace command gives reviewers a fast way to collect a smaller trace from the active TypeScript source file.

## Suggested Submission Text

This branch turns Type Complexity Tracer into a repeatable TSPerf measurement loop inside VS Code. It adds a portable `metrics.json` artifact for each compiler trace, parses stock TypeScript trace/type output, captures `--extendedDiagnostics` counters, and provides a `Tracer: Compare trace metrics` command that renders before/after deltas for wall time, type counts, instantiations, memory, compiler timing, parse status, and output changes.

The key workflow is:

1. Run `Tracer: tsc trace`.
2. Review the generated `metrics.json` artifact.
3. Make a type-heavy code change or switch branches.
4. Run another trace.
5. Use `Tracer: Compare trace metrics` to produce a Markdown comparison report.

This maps directly to the challenge requirement: an open-source MIT VS Code plugin that shows TypeScript type complexity and time-to-load evidence.

## Validation Evidence

Record the latest command output in the submission after running validation locally:

```text
pnpm lint
pnpm typecheck
pnpm build
pnpm exec vitest run
```

Optional package smoke test on Node 22:

```text
PATH="/opt/homebrew/opt/node@22/bin:$PATH" pnpm package
```

Node note: packaging can fail on Node 25 because a transitive package reads `SlowBuffer.prototype`; Node 22 packages successfully.
