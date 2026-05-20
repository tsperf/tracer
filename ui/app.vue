<script setup lang="ts">
import { sortBy, traceInsights } from './src/appState'

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

function analyzeTrace() {
  sendMesage('traceInsights', {})
}

function selectInsight(insight: typeof traceInsights.value[number]) {
  sendMesage('filterTree', {
    startsWith: insight.name,
    sourceFileName: insight.path ?? '',
    position: insight.pos ?? '',
  })
  if (insight.path && insight.pos !== undefined)
    sendMesage('gotoPosition', { fileName: insight.path, pos: insight.pos })
}

onMounted(() => {
  useNuxtApp().$initAppState()
  useNuxtApp().$initClient()
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
        <vscode-button class="mt-3 w-full" @click="analyzeTrace">
          Analyze Trace
        </vscode-button>
      </div>
    </div>
    <section v-if="traceInsights.length" class="mx-2 mt-2 border border-[var(--vscode-panel-border)]">
      <div class="grid grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,1fr)_minmax(8rem,0.7fr)_minmax(14rem,1.6fr)] gap-2 border-b border-[var(--vscode-panel-border)] px-2 py-1 text-xs uppercase opacity-70">
        <span>Trace node</span>
        <span>Source</span>
        <span>Why</span>
        <span>Suggestion</span>
      </div>
      <button
        v-for="insight of traceInsights"
        :key="insight.id"
        class="grid w-full grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,1fr)_minmax(8rem,0.7fr)_minmax(14rem,1.6fr)] gap-2 border-b border-[var(--vscode-panel-border)] px-2 py-1 text-left hover:bg-[var(--vscode-list-hoverBackground)]"
        @click="selectInsight(insight)"
      >
        <span class="truncate">{{ insight.name }}</span>
        <span class="truncate">{{ insight.path ? `${insight.path}:${insight.pos ?? ''}` : '' }}</span>
        <span class="truncate">{{ insight.reason }}</span>
        <span class="truncate">{{ insight.suggestion }}</span>
      </button>
    </section>
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
