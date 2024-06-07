<script setup lang="ts">
import { files, traceRunning } from '../src/appState'

const sendMessage = useNuxtApp().$sendMessage

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
</script>

<template>
  <div>
    <label class="border-solid border-b border-current" for="trace-file-list"> {{ files.length === 0 ? 'No ' : '' }} Files Loaded </label>
    <div v-for="({ fileName, dirName }) in files" id="trace-file-list" :key="`${dirName}/${fileName}`">
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
