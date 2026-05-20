import { describe, expect, it } from 'vitest'
import { getGeneratedSaveName, normalizeGeneratedSaveName } from '../src/saveNameCommand'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })

  it('normalizes command output into safe save names', () => {
    expect(normalizeGeneratedSaveName('\nfeature/perf-work\n'))
      .toBe('feature/perf-work')

    expect(normalizeGeneratedSaveName('../escape\n'))
      .toBe('-/escape')

    expect(normalizeGeneratedSaveName('bugfix:trace*view\n'))
      .toBe('bugfix-trace-view')

    expect(normalizeGeneratedSaveName('\n'))
      .toBe('default')
  })

  it('uses command stdout for generated save names and falls back on failures', async () => {
    await expect(getGeneratedSaveName('git branch --show-current', '/repo', async (command, options) => {
      expect(command).toBe('git branch --show-current')
      expect(options.cwd).toBe('/repo')
      return { stdout: 'main\n' }
    })).resolves.toBe('main')

    await expect(getGeneratedSaveName('', '/repo'))
      .resolves.toBeUndefined()

    await expect(getGeneratedSaveName('broken', '/repo', async () => {
      throw new Error('missing git repo')
    })).resolves.toBeUndefined()
  })
})
