import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { getProjectSettingsPath, readProjectSettings, writeProjectSettings } from '../src/projectSettings'

function tempProjectPath() {
  const path = mkdtempSync(join(tmpdir(), 'tracer-project-settings-'))
  mkdirSync(path, { recursive: true })
  return path
}

describe('project settings', () => {
  it('persists the last selected save name per project', () => {
    const projectPath = tempProjectPath()

    writeProjectSettings(projectPath, { lastSaveName: 'feature/fast-path' })

    expect(readProjectSettings(projectPath)).toEqual({ lastSaveName: 'feature/fast-path' })
  })

  it('falls back to empty settings when the file is missing or invalid', () => {
    const projectPath = tempProjectPath()

    expect(readProjectSettings(projectPath)).toEqual({})

    writeFileSync(getProjectSettingsPath(projectPath), '{not-json')
    expect(readProjectSettings(projectPath)).toEqual({})

    writeFileSync(getProjectSettingsPath(projectPath), JSON.stringify({ lastSaveName: 123 }))
    expect(readProjectSettings(projectPath)).toEqual({ lastSaveName: undefined })
  })
})
