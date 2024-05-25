<script setup lang="ts">
const Messages = useNuxtApp().$Messages
const colorMode = useColorMode()

const sendMesage = useNuxtApp().$sendMessage

const secondButtonLabel = ref('Another button')

const filters = useState('treeFilters', () => ({ startsWith: 'check', sourceFileName: '', position: 0 as number | '' }))

function handleMessage(e: MessageEvent<unknown>) {
  const message = Messages.message.safeParse(e.data)
  if (!message.success)
    return

  if (message.data.message === 'pong')
    secondButtonLabel.value = 'pong'

  else if (message.data.message === 'gotoTracePosition')
    filters.value = { startsWith: '', position: message.data.position, sourceFileName: message.data.fileName }

  else if (message.data.message === 'filterTree')
    filters.value = message.data
}

function doFilters() {
  sendMesage('filterTree', filters.value)
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

const iconName = computed(() => colorMode.value === 'light' ? 'heroicons:sun' : 'heroicons:moon')
function toggleDarkMode() {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-evenly">
      <div>
        <PersistentState />
      </div>
      <!-- Note the kebab case is mandatory for the vscode components.  <VscodeButton> will not work -->
      <!-- <dev-only>
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
      </dev-only> -->

      <file-manager />
      <ULabled icon="magnifying-glass-circle" label-div-class="h-full bg-primary text-black place-content-center" :icon-click="doFilters">
        <div class="flex flex-col gap-1">
          <ULabled label="Trace Name">
            <UInput v-model="filters.startsWith" />
          </ULabled>
          <ULabled label="Source File">
            <UInput v-model="filters.sourceFileName" />
          </ULabled>
          <ULabled label="Position">
            <UInput v-model="filters.position" label="Position" type="number" />
            <ULabled />
          </ULabled>
        </div>
      </ULabled>
      <div>
        <p class="p-4 pb-2">
          <UIcon
            v-model="colorMode.preference" :name="iconName"
            :dynamic="true" @click="toggleDarkMode"
          />
        </p>
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
