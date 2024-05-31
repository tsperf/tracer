<script setup lang="ts">
const Messages = useNuxtApp().$Messages

const sendMesage = useNuxtApp().$sendMessage

const sortOptions = ['Timestamp', 'Duration', 'Types', 'Total Types'] as const
const sortBy = ref('Timestamp' as (typeof sortOptions)[number])

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
</script>

<template>
  <div class="flex flex-col w-max overflow-x-auto">
    <div class="flex flex-row justify-evenly w-screen">
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
        <vscode-button class="w-full" @click="doFilters">
          Filter Trace <UIcon name="heroicons:magnifying-glass-circle" :dynamic="true" size="20" />
        </vscode-button>
      </div>
      <div class="flex flex-col gap-1">
        <ULabled label="Sort By">
          <USelect v-model="sortBy" :options="sortOptions" />
        </ULabled>
      </div>
    </div>
    <div>
      <tree-root :sort-by="sortBy" />
    </div>

    <dev-controls />
  </div>
</template>

<style lang="postcss">
body {
  @apply min-h-screen;
  color: var(--vscode-editor-foreground);
  background-color: var(--vscode-editor-background);
}
</style>
