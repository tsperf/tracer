<script setup lang="ts">
const sendMessage = useNuxtApp().$sendMessage
const Messages = useNuxtApp().$Messages
const colorMode = useColorMode()

function ping() {
  sendMessage({ message: 'ping' })
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
    <div>
      <p class="p-4 pb-2">
        <select
          v-model="colorMode.preference"
          class="border w-24 h-8 dark:bg-gray-900 dark:text-white dark:border-gray-700"
        >
          <option value="system">
            System
          </option>
          <option value="light">
            Light
          </option>
          <option value="dark">
            Dark
          </option>
        </select>
      </p>
    </div>
    <!-- Note the kebab case is mandatory for the vscode components.  <VscodeButton> will not work -->
    <div>
      <vscode-button appearance="primary" @click="ping">
        Ping
      </vscode-button>
    </div>
    <div>
      <vscode-button appearance="secondary" @click="secondButtonLabel = 'Another button'">
        {{ secondButtonLabel }}
      </vscode-button>
    </div>

    <file-manager />
    <div>
      <tree-root />
    </div>

    <dev-controls />
  </div>
</template>

<style lang="postcss">
body {
  @apply min-h-screen bg-white dark:bg-gray-800 dark:text-gray-200;
}
</style>
