// https://github.com/unjs/nitro/tree/main/src/rollup/plugins/raw.ts

import { promises as fsp } from 'node:fs'
import { dirname, resolve } from 'node:path'

/** @type {() => import('rollup').Plugin} */
export function raw() {
  return {
    name: 'raw',
    resolveId(id, importer) {
      if (id.endsWith('?raw')) {
        id = id.replace(/\?raw$/, '')
        if (importer)
          id = resolve(dirname(importer), id)

        return { id: `\0raw:${id}` }
      }
    },
    load(id) {
      if (id.startsWith('\0raw:'))
        return fsp.readFile(id.slice(5), 'utf8')
    },
    transform(code, id) {
      if (id.startsWith('\0raw:')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null,
        }
      }
    },
  }
}
