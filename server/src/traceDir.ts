import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { traceLine } from './traceData'
import { inserts } from './dbSchema'

const traceDir = '/tmp/tsTrace/' // TODO: read from command line

mkdirSync(traceDir, { recursive: true })

export async function loadTrace() {
  const insert = inserts.get('TraceLine')!

  const traceStr = readFileSync(join(traceDir, 'trace.json')).toString()
  const traceJson = JSON.parse(traceStr)
  const arr = []
  let i = 0
  let statementsRan = 0
  if (Array.isArray(traceJson)) {
    for (const line of traceJson) {
      const parsed = traceLine.safeParse(line)
      if (parsed.data) {
        const mod = i % 20
        arr[mod] = parsed.data
        if (i > 0 && mod === 0) {
          await insert(arr)
          statementsRan++
        }
        i++

        // await insert(parsed.data);
      }
    }
  }
  console.log(`trace lines inserted: ${i} in ${statementsRan} inserts`)
}
