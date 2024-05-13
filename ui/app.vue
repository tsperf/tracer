<script setup lang="ts">
import { onMounted } from 'vue'

const nuxtApp = useNuxtApp()

const vscode = nuxtApp.$vscode

function ping() {
  vscode.postMessage('ping')
}

const secondButtonLabel = ref('Another button')

const err = ref('')

function handleMessage(e: MessageEvent<unknown>) {
  err.value = ''
  if (typeof e.data === 'string')
    secondButtonLabel.value = e.data
  else
    err.value = JSON.stringify(e.data, null, 2)
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div>
    <!-- Note the kebab case is mandatory for the vscode components.  <VscodeButton> will not work -->
    <vscode-button appearance="primary" @click="ping">
      Ping
    </vscode-button>
    <vscode-button appearance="secondary" @click="secondButtonLabel = 'Another button'">
      {{ secondButtonLabel }}
    </vscode-button>
  </div>
</template>
