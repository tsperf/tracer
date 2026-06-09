import { describe, expect, it } from 'vitest'
import { toGitSaveName } from '../src/gitSaveName'

describe('should', () => {
  it('exported', () => {
    expect(1).toEqual(1)
  })
})

describe('toGitSaveName', () => {
  it('keeps simple branch names', () => {
    expect(toGitSaveName('main')).toBe('main')
  })

  it('normalizes branch labels into safe save names', () => {
    expect(toGitSaveName(' feature/git branch:save ')).toBe('feature-git-branch-save')
  })

  it('ignores empty labels', () => {
    expect(toGitSaveName(' / ')).toBeUndefined()
  })
})
