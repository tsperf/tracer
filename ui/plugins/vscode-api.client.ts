import type { WebviewApi } from 'vscode-webview'
import * as Messages from '../../shared/src/messages'

const dummyVscode: WebviewApi<unknown> = {
  postMessage: (_message: unknown) =>
    parent.postMessage(_message, '*'),
  getState: () => undefined,
  setState: <T>(newState: T) => newState,
}

export default defineNuxtPlugin(() => {
  const vscode = typeof acquireVsCodeApi === 'undefined' ? dummyVscode : acquireVsCodeApi()

  const messageLog = useState('messageLog', () => [] as Messages.Message[])
  function sendMessage<T extends Messages.MessageType>(message: T, values: Messages.MessageValues<T>) {
    const fullMessage = { ...values, message }
    messageLog.value.unshift(fullMessage as any)
    vscode.postMessage(fullMessage)
  }

  function initClient() {
    vscode.postMessage('init client')
  }

  return {
    provide: {
      sendMessage,
      messageLog,
      Messages,
      initClient,
    },
  }
})
