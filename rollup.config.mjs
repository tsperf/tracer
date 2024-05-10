import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import { raw } from './build/raw.mjs'

export default defineConfig({
  external: ['vscode', 'typescript', /^node:.*/],
  input: ['./src/index.ts', './src/worker.ts'],
  output: { format: 'cjs', dir: 'dist' },
  plugins: [esbuild(), raw()],
})
