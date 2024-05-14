<script setup lang="ts">
const vscode = useNuxtApp().$vscode
const Messages = useNuxtApp().$Messages

function ping() {
  vscode.postMessage({ message: 'ping' })
}

const secondButtonLabel = ref('Another button')

function handleMessage(e: MessageEvent<unknown>) {
  if (Messages.pong.safeParse(e.data).success)
    secondButtonLabel.value = 'pong'
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
