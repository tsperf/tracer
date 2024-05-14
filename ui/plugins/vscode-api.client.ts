import * as Messages from '../../messages/src/messages'

export default defineNuxtPlugin(() => {
  // allow development with hmr
  if (typeof acquireVsCodeApi === 'undefined')
    return

  return {
    provide: {
      vscode: acquireVsCodeApi(),
      Messages,
    },
  }
})
