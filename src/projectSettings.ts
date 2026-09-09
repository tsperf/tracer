import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export interface ProjectSettings {
  lastSaveName?: string
}

const projectSettingsFileName = 'tracer-project-settings.json'

export function getProjectSettingsPath(projectPath: string) {
  return join(projectPath, projectSettingsFileName)
}

function parseProjectSettings(value: unknown): ProjectSettings {
  if (!value || typeof value !== 'object')
    return {}

  const settings = value as Record<string, unknown>

  return {
    lastSaveName: typeof settings.lastSaveName === 'string' ? settings.lastSaveName : undefined,
  }
}

export function readProjectSettings(projectPath: string): ProjectSettings {
  const settingsPath = getProjectSettingsPath(projectPath)
  if (!existsSync(settingsPath))
    return {}

  try {
    return parseProjectSettings(JSON.parse(readFileSync(settingsPath, 'utf8')))
  }
  catch {
    return {}
  }
}

export function writeProjectSettings(projectPath: string, settings: ProjectSettings) {
  writeFileSync(getProjectSettingsPath(projectPath), `${JSON.stringify(settings, null, 2)}\n`)
}
