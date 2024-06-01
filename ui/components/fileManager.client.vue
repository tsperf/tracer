<script setup lang="ts">
const Messages = useNuxtApp().$Messages

const sendMessage = useNuxtApp().$sendMessage

const files = ref([] as { fileName: string, dirName: string }[])

const traceRunning = ref(false)

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  switch (parsed.data.message) {
    case 'traceFileLoaded':
      if (parsed.data.resetFileList)
        files.value = []
      if (parsed.data.fileName)
        files.value.push(parsed.data)
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

function deleteTraceFile(fileName: string, dirName: string) {
  sendMessage('deletTraceFile', { fileName, dirName })
  const newFiles = files.value.filter(x => !(x.dirName === dirName && x.fileName === fileName))
  files.value = newFiles
}

function deleteAllTraceFiles() {
  for (const { fileName, dirName } of files.value) {
    deleteTraceFile(fileName, dirName)
  }
}

onMounted(async () => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div>
    <div> Files Loaded </div>
    <div v-for="({ fileName, dirName }) in files" :key="`${dirName}/${fileName}`">
      <div>{{ fileName }} </div>
    </div>
    <div v-if="traceRunning" class="flex flex-row gap-2">
      <span> traceRunning</span>
      <vscode-progress-ring class="h-6" />
    </div>
    <vscode-button @click="deleteAllTraceFiles">
      Delete All
    </vscode-button>
  </div>
</template>
