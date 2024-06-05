<script setup lang="ts">
import { sortBy } from './src/appState'

const Messages = useNuxtApp().$Messages

const sendMesage = useNuxtApp().$sendMessage

const sortOptions = ['Timestamp', 'Duration', 'Types', 'Total Types'] as const

const filters = useState('treeFilters', () => ({ startsWith: 'check', sourceFileName: '', position: 0 as number | '' }))

function setStartsWith(event: any) {
  filters.value.startsWith = event.target.value
}

function setSourceFileName(event: any) {
  filters.value.sourceFileName = event.target.value
}

function setPosition(event: any) {
  filters.value.position = +event.target.value
}

function handleMessage(e: MessageEvent<unknown>) {
  const message = Messages.message.safeParse(e.data)
  if (!message.success)
    return

  if (message.data.message === 'gotoTracePosition')
    filters.value = { startsWith: '', position: message.data.position, sourceFileName: message.data.fileName }

  else if (message.data.message === 'filterTree')
    filters.value = message.data
}

function updateSort(event: any) {
  if (event?.target?.value)
    sortBy.value = event.target.value
}
function doFilters() {
  sendMesage('filterTree', filters.value)
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div class="flex flex-col w-full ">
    <div class="flex flex-row justify-evenly ">
      <div>
        <PersistentState />
      </div>
      <file-manager />
      <div class="flex flex-col gap-2">
        <VTextField v-model="filters.startsWith" label="Trace Name" @change="setStartsWith" />
        <VTextField v-model="filters.sourceFileName" label="Source File" @change="setSourceFileName" />
        <VTextField v-model="filters.position" label="Position" type="number" @change="setPosition" />
        <vscode-button class="w-full" @click="doFilters">
          Filter Trace <UIcon name="heroicons:magnifying-glass-circle" :dynamic="true" size="20" />
        </vscode-button>
      </div>
      <div class="dropdown-container">
        <label for="my-dropdown">Sort By</label>
        <vscode-dropdown id="my-dropdown" :value="sortBy" @change="updateSort">
          <template v-for="value of sortOptions" :key="value">
            <vscode-option :selected="value === sortBy">
              {{ value }}
            </vscode-option>
          </template>
        </vscode-dropdown>
      </div>
    </div>
    <hr class="m-2">
    <div>
      <tree-root />
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

label {
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
