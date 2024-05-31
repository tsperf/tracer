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
        <VTextField v-model="filters.startsWith" label="Trace Name" />
        <VTextField v-model="filters.sourceFileName" label="Source File" />
        <VTextField v-model="filters.position" label="Position" type="number" />
        <vscode-button class="w-full" @click="doFilters">
          Filter Trace <UIcon name="heroicons:magnifying-glass-circle" :dynamic="true" size="20" />
        </vscode-button>
      </div>
      <div class="flex flex-col gap-1">
        <ULabled label="Sort By" container-class="dropdown-container" label-class="dropdown-container label">
          <USelect v-model="sortBy" :options="sortOptions" select-class="dark:focus:ring-[var(--vscode-focusBorder)]" />
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
  font-family: var(--vscode-editor-font-family);
  font-weight: var(--vscode-editor-font-weight);
  font-size: var(--vscode-editor-font-size);
}

.dropdown-container {
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: var(--vscode-editor-background);
}

.dropdown-container .label {
  display: block;
  color: var(--vscode-foreground);
  cursor: pointer;
  font-size: var(--vscode-font-size);
  font-family: var(--vscode-font-family);
  font-weight: var(--vscode-font-weight);
  line-height: normal;
  margin-bottom: 2px;
}
</style>
