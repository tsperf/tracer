import type { Button, ProgressRing, Tag, TextField } from '@vscode/webview-ui-toolkit'
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeProgressRing, vsCodeTag, vsCodeTextField } from '@vscode/webview-ui-toolkit'
import type { DefineComponent } from 'vue'

export default defineNuxtPlugin(() => {
  provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeProgressRing(), vsCodeTextField(), vsCodeTag())
})

declare module 'vue' {
  interface GlobalComponents {
    VscodeButton: DefineComponent<any, Button>
    VscodeProgressRing: DefineComponent<any, ProgressRing>
    VscodeTextField: DefineComponent<any, TextField>
    VscodeTag: DefineComponent<any, Tag>

  }
}
