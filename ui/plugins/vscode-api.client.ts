import type { WebviewApi } from 'vscode-webview'
import * as Messages from '../../messages/src/messages'

const dummyVscode: WebviewApi<unknown> = {
  postMessage: (_message: unknown) => undefined,
  getState: () => undefined,
  setState: <T>(newState: T) => newState,
}

export default defineNuxtPlugin(() => {
  const vscode = typeof acquireVsCodeApi === 'undefined' ? dummyVscode : acquireVsCodeApi()

  return {
    provide: {
      vscode,
      Messages,
    },
  }
})
