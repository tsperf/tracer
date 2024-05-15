<script setup lang="ts">
const sendMessage = useNuxtApp().$sendMessage
const Messages = useNuxtApp().$Messages
const colorMode = useColorMode()

function ping() {
  sendMessage({ message: 'ping' })
}

const secondButtonLabel = ref('Another button')

const filters = useState('treeFilters', () => ({ startsWith: 'check', sourceFileName: '', position: 0 }))

function handleMessage(e: MessageEvent<unknown>) {
  const message = Messages.message.safeParse(e.data)
  if (!message.success)
    return

  if (message.data.message === 'pong')
    secondButtonLabel.value = 'pong'

  else if (message.data.message === 'gotoTracePosition')
    filters.value = { startsWith: '', position: message.data.position, sourceFileName: message.data.fileName }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-evenly">
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
      <dev-only>
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
      </dev-only>

      <file-manager />
      <div class="flex flex-col">
        <div class="flex flex-row justify-between gap-2 content-center">
          Trace Name: <UInput v-model="filters.startsWith" label="Trace Name Starts With" />
        </div>
        <div class="flex flex-row justify-between content-center">
          Source File: <UInput v-model="filters.sourceFileName" label="Source File" />
        </div>
        <div class="flex flex-row justify-between content-center">
          Position: <UInput v-model="filters.position" label="Position" type="number" />
        </div>
      </div>
    </div>
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
