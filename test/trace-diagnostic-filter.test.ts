import { describe, expect, it } from 'vitest'
import { shouldSuppressTraceDiagnostic } from '../src/traceDiagnosticFilter'

describe('shouldSuppressTraceDiagnostic', () => {
  it('suppresses declaration files', () => {
    expect(shouldSuppressTraceDiagnostic('node_modules/typescript/lib/lib.es2020.date.d.ts', 'declare const Date: DateConstructor', 10)).toBe(true)
  })

  it('suppresses type alias diagnostics anywhere in the declaration', () => {
    const source = `export type ConstructorOf<Instance extends object> = new (
  ...args: any[]
) => Instance`

    expect(shouldSuppressTraceDiagnostic('src/example.ts', source, source.indexOf('any[]'))).toBe(true)
  })

  it('suppresses interface diagnostics', () => {
    const source = `export interface Person {
  name: string
}`

    expect(shouldSuppressTraceDiagnostic('src/example.ts', source, source.indexOf('string'))).toBe(true)
  })

  it('keeps value-level diagnostics', () => {
    const source = `export const person: Person = {
  name: 'Ada',
}`

    expect(shouldSuppressTraceDiagnostic('src/example.ts', source, source.indexOf('Person'))).toBe(false)
  })
})
