import { describe, expect, it, vi } from 'vitest'
import { toTree } from '../src/traceTree'
import type { TraceData } from '../shared/src/traceData'

vi.mock('../src/storage', () => ({
  getWorkspacePath: vi.fn(() => '/workspace'),
}))

vi.mock('../src/webview', () => ({
  postMessage: vi.fn(),
}))

vi.mock('../src/appState', () => ({
  traceFiles: { value: {} },
}))

vi.mock('vscode', () => ({
  workspace: {
    workspaceFolders: [{ uri: { fsPath: '/workspace' } }],
    getConfiguration: vi.fn(() => ({
      get: vi.fn(),
    })),
    onDidChangeConfiguration: vi.fn(),
  },
  window: {
    showErrorMessage: vi.fn(),
    createOutputChannel: vi.fn(() => ({
      appendLine: vi.fn(),
      show: vi.fn(),
    })),
  },
  env: {
    appRoot: '/Applications/Visual Studio Code.app',
  },
}))

describe('traceTree', () => {
  it('does not crash or attribute untimestamped types', () => {
    const data: TraceData = [
      {
        pid: 1,
        tid: 1,
        ph: 'X',
        cat: 'check',
        ts: 10,
        name: 'checkSourceFile',
        dur: 20,
        args: { path: '/workspace/src/index.ts', pos: 1, end: 2 },
      },
      {
        id: 1,
        intrinsicName: 'string',
        recursionId: 1,
        flags: ['String'],
        display: 'string',
      },
    ]

    const tree = toTree(data, '/workspace')

    expect(tree.children).toHaveLength(1)
    expect(tree.children[0].types).toHaveLength(0)
    expect(tree.children[0].typeCnt).toBe(0)
  })
})
