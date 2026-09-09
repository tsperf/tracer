import { describe, expect, it } from 'vitest'
import { parseExtendedDiagnostics } from '../src/extendedDiagnostics'

describe('extended diagnostics parser', () => {
  it('parses tsc --extendedDiagnostics counters, memory, and timings', () => {
    const diagnostics = parseExtendedDiagnostics(`
src/index.ts(1,1): error TS2322: Type 'string' is not assignable to type 'number'.
Files:                         128
Lines of Library:           38,470
Lines of Definitions:        1,234
Lines of TypeScript:           456
Lines of JavaScript:             7
Lines of JSON:                   3
Lines of Other:                  2
Identifiers:                52,001
Symbols:                    39,120
Types:                      14,567
Instantiations:              8,901
Memory used:               174356K
Parse time:                  0.36s
Bind time:                   0.10s
Check time:                  1.25s
Emit time:                   0.00s
Total time:                  1.71s
`)

    expect(diagnostics).toMatchObject({
      files: 128,
      lines: {
        library: 38470,
        definitions: 1234,
        typescript: 456,
        javascript: 7,
        json: 3,
        other: 2,
      },
      identifiers: 52001,
      symbols: 39120,
      types: 14567,
      instantiations: 8901,
      memoryUsedKb: 174356,
      parseTimeMs: 360,
      bindTimeMs: 100,
      checkTimeMs: 1250,
      emitTimeMs: 0,
      totalTimeMs: 1710,
      metrics: {
        memoryUsed: { value: 174356, unit: 'kb', raw: '174356K' },
        checkTime: { value: 1250, unit: 'ms', raw: '1.25s' },
      },
    })
  })

  it('keeps supplemental extended diagnostics in the metrics map', () => {
    const diagnostics = parseExtendedDiagnostics(`
Assignability cache size:       99
I/O Read time:                0.01s
ResolveModule time:           0.02s
printTime time:               0.03s
`)

    expect(diagnostics?.metrics).toMatchObject({
      assignabilityCacheSize: { value: 99, unit: 'count', raw: '99' },
      ioReadTime: { value: 10, unit: 'ms', raw: '0.01s' },
      resolveModuleTime: { value: 20, unit: 'ms', raw: '0.02s' },
      printTime: { value: 30, unit: 'ms', raw: '0.03s' },
    })
  })

  it('returns undefined when no extended diagnostics are present', () => {
    expect(parseExtendedDiagnostics('error TS2307: Cannot find module')).toBeUndefined()
  })
})
