import type { Button, ProgressRing } from '@vscode/webview-ui-toolkit'
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeProgressRing } from '@vscode/webview-ui-toolkit'
import type { DefineComponent } from 'vue'

export default defineNuxtPlugin(() => {
  provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeProgressRing())
})

declare module 'vue' {
  interface GlobalComponents {
    VscodeButton: DefineComponent<any, Button>
    VscodeProgressRing: DefineComponent<any, ProgressRing>
  }
}
