import * as appState from '../src/appState'

export default defineNuxtPlugin(() => {
  return { provide: { initAppState: appState.init, appState } }
})
