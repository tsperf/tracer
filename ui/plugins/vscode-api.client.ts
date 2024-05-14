import type { WebviewApi } from 'vscode-webview'
import * as Messages from '../../messages/src/messages'

const dummyVscode: WebviewApi<unknown> = {
  postMessage: (_message: unknown) => undefined,
  getState: () => undefined,
  setState: <T>(newState: T) => newState,
}

export default defineNuxtPlugin(() => {
  const vscode = typeof acquireVsCodeApi === 'undefined' ? dummyVscode : acquireVsCodeApi()

  const messageLog = useState('messageLog', () => [] as Messages.Message[])
  function sendMessage(message: Messages.Message) {
    messageLog.value.unshift(message)
    vscode.postMessage(message)
  }

  return {
    provide: {
      sendMessage,
      messageLog,
      Messages,
    },
  }
})
