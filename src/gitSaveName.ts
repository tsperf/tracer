export function toGitSaveName(label: string | undefined): string | undefined {
  const normalized = label
    ?.trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || undefined
}
