import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  external: [/^node:.*/],
  input: ['./src/index.ts'],
  output: { format: 'cjs', dir: 'dist' },
  plugins: [esbuild(), resolve(), commonjs()],
})
