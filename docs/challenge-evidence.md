# TSPerf Challenge Evidence

This page gives reviewers a quick look at the artifacts produced by the challenge branch before they run the extension locally.

## Metrics Artifact

Each `Tracer: tsc trace` run writes a `metrics.json` file next to the TypeScript trace output. A representative artifact has this shape:

```json
{
  "version": 1,
  "command": "npx tsc --noEmit --generateTrace .trace/tsperf-main",
  "cwd": "/workspace/example-project",
  "traceDir": "/workspace/example-project/.trace/tsperf-main",
  "startedAt": "2026-05-20T09:42:11.000Z",
  "endedAt": "2026-05-20T09:42:14.250Z",
  "wallTimeMs": 3250,
  "exitCode": 0,
  "stdout": {
    "bytes": 0,
    "truncated": false,
    "text": ""
  },
  "stderr": {
    "bytes": 382,
    "truncated": false,
    "text": "Files: 42\nTypes: 1400\nInstantiations: 700\nMemory used: 78000K\nCheck time: 0.32s\nTotal time: 1.10s\n"
  },
  "extendedDiagnostics": {
    "types": 1400,
    "instantiations": 700,
    "memoryUsedKb": 78000,
    "checkTimeMs": 320,
    "totalTimeMs": 1100
  },
  "traceJsonFiles": [
    {
      "fileName": "trace.json",
      "bytes": 183224
    },
    {
      "fileName": "types.json",
      "bytes": 92130
    }
  ],
  "parse": {
    "status": "ok"
  }
}
```

The high-signal TSPerf fields are:

- `wallTimeMs`: end-to-end trace command duration.
- `traceJsonFiles`: whether trace output was actually produced.
- `parse.status`: whether generated JSON can be parsed.
- `extendedDiagnostics.types`: total TypeScript type count.
- `extendedDiagnostics.instantiations`: generic/type instantiation pressure.
- `extendedDiagnostics.checkTimeMs`: checker cost.
- `extendedDiagnostics.totalTimeMs`: total compiler time.

## Comparison Report

`Tracer: Compare trace metrics` turns two `metrics.json` files into a Markdown delta report:

```markdown
# Trace Metrics Comparison

Exit code: 0 -> 0
Parse status: ok -> ok

| Metric | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Wall time ms | 3250 | 2785 | -465 |
| Trace JSON files | 2 | 2 | 0 |
| Types | 1400 | 1100 | -300 |
| Instantiations | 700 | 450 | -250 |
| Memory used KB | 78000 | 69000 | -9000 |
| Parse time ms | 120 | 110 | -10 |
| Bind time ms | 80 | 78 | -2 |
| Check time ms | 320 | 210 | -110 |
| Emit time ms | 0 | 0 | 0 |
| Total time ms | 1100 | 870 | -230 |
```

This is the reviewable loop for the challenge:

1. Run a baseline trace.
2. Change a type-heavy branch, file, or dependency version.
3. Run a comparison trace.
4. Use the generated report to see whether type count, instantiations, memory, check time, and total time improved or regressed.

## Focused Current-File Trace

`Tracer: Trace current file` gives reviewers a quicker path for a smaller trace. From a TypeScript editor, the command creates a workspace-relative trace name for the active file and runs the configured trace command in that context. That makes it easier to test a single type-heavy area without manually naming trace directories.
