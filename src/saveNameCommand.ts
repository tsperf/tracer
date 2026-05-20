import { exec } from 'node:child_process'
import { env } from 'node:process'

export const defaultSaveName = 'default'

export interface SaveNameCommandRunner {
  (command: string, options: { cwd: string, timeout: number, maxBuffer: number, shell?: string }): Promise<{ stdout: string }>
}

const runShellCommand: SaveNameCommandRunner = (command, options) =>
  new Promise((resolve, reject) => {
    exec(command, options, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }

      resolve({ stdout })
    })
  })

function normalizeSegment(segment: string): string {
  const trimmed = segment.trim()
  if (!trimmed || trimmed === '.' || trimmed === '..')
    return '-'

  const printable = Array.from(trimmed, char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 ? '-' : char).join('')

  return printable
    .replace(/[<>:"|?*]/g, '-')
    .replace(/[^\w .@+=,-]/g, '-')
    .replace(/-+/g, '-')
}

export function normalizeGeneratedSaveName(output: string, fallback = defaultSaveName): string {
  const firstLine = output.split(/\r?\n/).map(line => line.trim()).find(Boolean)
  if (!firstLine)
    return fallback

  const name = firstLine
    .replace(/\\/g, '/')
    .split('/')
    .map(normalizeSegment)
    .filter(Boolean)
    .join('/')

  return name || fallback
}

export async function getGeneratedSaveName(command: string, cwd: string, runner: SaveNameCommandRunner = runShellCommand) {
  const trimmedCommand = command.trim()
  if (!trimmedCommand)
    return undefined

  try {
    const { stdout } = await runner(trimmedCommand, {
      cwd,
      shell: env.SHELL,
      timeout: 2000,
      maxBuffer: 4096,
    })
    return normalizeGeneratedSaveName(stdout)
  }
  catch (_error) {
    return undefined
  }
}
