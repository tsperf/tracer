import type { Button } from '@vscode/webview-ui-toolkit'
import { provideVSCodeDesignSystem, vsCodeButton } from '@vscode/webview-ui-toolkit'
import type { DefineComponent } from 'vue'

export default defineNuxtPlugin(() => {
  provideVSCodeDesignSystem().register(vsCodeButton())
})

declare module 'vue' {
  interface GlobalComponents {
    VscodeButton: DefineComponent<any, Button>
  }
}
