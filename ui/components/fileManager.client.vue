<script setup lang="ts">
const Messages = useNuxtApp().$Messages

const files = reactive([] as { fileName: string, dirName: string }[])

const traceRunning = ref(false)

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  switch (parsed.data.message) {
    case 'traceFileLoaded':
      if (parsed.data.resetFileList)
        files.length = 0
      if (parsed.data.fileName)
        files.push(parsed.data)
      break

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

onMounted(async () => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div>
    <div v-for="({ fileName, dirName }) in files" :key="`${dirName}/${fileName}`">
      <div>{{ fileName }} </div>
    </div>
    <div v-if="traceRunning">
      traceRunning
      <UProgress :indeterminate="true" />
    </div>
    <div />
  </div>
</template>
