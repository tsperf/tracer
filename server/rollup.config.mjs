import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { copy } from '@web/rollup-plugin-copy'

export default defineConfig({
  external: [/^node:.*/],
  input: ['./src/index.ts'],
  output: { format: 'cjs', dir: 'dist' },
  plugins: [esbuild(), resolve(), commonjs(), copy({ patterns: 'lib/**/*', rootDir: '../node_modules/typescript/' })],
})
