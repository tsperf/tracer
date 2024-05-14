<script setup lang="ts">
import vscodeApiClient from '~/plugins/vscode-api.client'
import { type TraceData, traceData } from '~/src/traceData'
import { type Tree, toTree } from '~/src/traceTree'

const Messages = useNuxtApp().$Messages

const files = useState('files', () => ({}) as Record<string, TraceData>)

const traceTree = useState('traceTree', () => undefined as Tree | undefined)

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.traceFile.safeParse(e.data)
  if (!parsed.success)
    return

  try {
    const json = JSON.parse(parsed.data.traceString)
    const arr = traceData.safeParse(json)
    if (!arr.success)
      return

    files.value[parsed.data.fileName] = arr.data
  }
  catch (_e) {}
}
function processTraces() {
  const values = Object.values(files.value).flat(1) as unknown as TraceData
  // eslint-disable-next-line no-debugger, no-restricted-syntax
  debugger
  const tree = toTree(values)
  traceTree.value = tree
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div
    v-for="(_data, fileName) in files" :key="fileName"
  >
    <div>{{ fileName }}</div>
    <!-- <pre>{{ _data }}</pre> -->
    <vscode-button @click="processTraces">
      Process Traces
    </vscode-button>
  </div>
</template>
