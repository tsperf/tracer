<script setup lang="ts">
import * as Messages from '../../messages/src/messages'
import { type TraceData, traceData } from '~/src/traceData'
import { type Tree, toTree } from '~/src/traceTree'

const files = useState('files', () => ({}) as Record<string, TraceData>)

const traceTree = useState('traceTree', () => undefined as Tree | undefined)

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  if (parsed.data.message === 'traceFile') {
    try {
      const json = JSON.parse(parsed.data.traceString)

      const arr = traceData.safeParse(json)
      if (!arr.success)
        return

      files.value[parsed.data.fileName] = arr.data
    }
    catch (_e) {}
  }
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
  <div>
    <div v-for="(_data, fileName) in files" :key="fileName">
      <div>{{ fileName }}</div>
    </div>
    <vscode-button @click="processTraces">
      Process Traces
    </vscode-button>
    <div />
  </div>
</template>
