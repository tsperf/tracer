<script setup lang="ts">
import * as Messages from '../../messages/src/messages'
import { type TraceData, traceData } from '~/src/traceData'
import { type Tree, toTree } from '~/src/traceTree'

import { files, traceTree } from '~/src/fileState'

const tmpTraceStrings: Record<string, string> = {}

const fileProgress = reactive({} as Record<string, string>)

const fileSizes = reactive({} as Record<string, [number, number]>)

const inProcess = ref(0)

const traceRunning = ref(false)

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  switch (parsed.data.message) {
    case 'traceFileStart':
      inProcess.value++
      fileSizes[parsed.data.fileName] = [0, parsed.data.size]
      tmpTraceStrings[parsed.data.fileName] = ''
      files.value[parsed.data.fileName] ??= []
      break

    case 'traceFileChunk': {
      const fileName = parsed.data.fileName
      const size = fileSizes[fileName]
      size[0] += parsed.data.chunk.length
      fileProgress[fileName] = size.join(' / ')
      tmpTraceStrings[fileName] += parsed.data.chunk
      break
    }

    case 'traceFileEnd': {
      inProcess.value--
      fileProgress[parsed.data.fileName] = 'Received'

      try {
        const json = JSON.parse(tmpTraceStrings[parsed.data.fileName])

        const arr = traceData.safeParse(json)
        if (!arr.success)
          return

        files.value[parsed.data.fileName] = arr.data
        triggerRef(files)
      }
      catch (_e) {}

      break
    }

    case 'traceStart': {
      traceRunning.value = true
      break
    }

    case 'traceStop': {
      traceRunning.value = false
      break
    }
  }
}

function processTraces() {
  const values = Object.values(files.value).flat(1) as unknown as TraceData
  const tree = toTree(values)
  traceTree.value = tree
}

onMounted(async () => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div>
    <div v-if="traceRunning">
      traceRunning
      <UProgress :indeterminate="true" />
    </div>
    <div v-for="(_data, fileName) in files" :key="fileName">
      <div>{{ fileName }}  {{ fileProgress[fileName] }}</div>
    </div>
    <vscode-button :disable="inProcess > 0" @click="processTraces">
      Process Traces
    </vscode-button>
    <div />
  </div>
</template>
