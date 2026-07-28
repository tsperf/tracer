import { isAbsolute, normalize } from 'node:path'

export const DEFAULT_SAVE_NAME = 'default'

export function normalizeSaveName(value: string) {
  const trimmed = value.trim()
  if (!trimmed)
    return DEFAULT_SAVE_NAME

  const rawParts = trimmed.split(/[\\/]+/).filter(Boolean)
  if (rawParts.includes('..'))
    return DEFAULT_SAVE_NAME
  if (/^(?:[a-z]:[\\/]|\\\\)/i.test(trimmed))
    return DEFAULT_SAVE_NAME

  const normalized = normalize(trimmed).replaceAll(/\\/g, '/')
  if (isAbsolute(normalized))
    return DEFAULT_SAVE_NAME

  const parts = normalized.split('/').filter(Boolean)
  if (!parts.length || parts.includes('..'))
    return DEFAULT_SAVE_NAME

  return parts.join('/')
}
