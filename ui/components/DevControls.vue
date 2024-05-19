<script setup lang="ts">
const messageLog = useNuxtApp().$messageLog
const message = ref('')

function postMessage() {
  window.postMessage(JSON.parse(message.value.replaceAll('\n', '')))
}
</script>

<template>
  <dev-only>
    <div>
      Send Command<br>
      <textarea v-model="message" cols="200" rows="15" style="color: wheat; background-color: black; " />
      <vscode-button appereance="secondary" @click="postMessage">
        post
      </vscode-button>
    </div>
    <div>
      <pre> {{ messageLog }} </pre>
    </div>
  </dev-only>
</template>
