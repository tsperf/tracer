import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'

export default defineConfig([
  {
    external: [/^node:.*/],
    input: ['./src/server.ts'],
    output: { format: 'cjs', dir: 'dist/server' },
    plugins: [esbuild()],
  },
])
