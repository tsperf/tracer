import type { Button, Dropdown, Option, ProgressRing, Tag, TextField } from '@vscode/webview-ui-toolkit'
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown, vsCodeOption, vsCodeProgressRing, vsCodeTag, vsCodeTextField } from '@vscode/webview-ui-toolkit'
import type { DefineComponent } from 'vue'

export default defineNuxtPlugin(() => {
  provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeProgressRing(), vsCodeTextField(), vsCodeTag(), vsCodeDropdown(), vsCodeOption())
})

declare module 'vue' {
  interface GlobalComponents {
    VscodeButton: DefineComponent<any, Button>
    VscodeProgressRing: DefineComponent<any, ProgressRing>
    VscodeTextField: DefineComponent<any, TextField>
    VscodeTag: DefineComponent<any, Tag>
    VscodeDropdown: DefineComponent<any, Dropdown>
    VscodeOption: DefineComponent<any, Option>
  }
}
