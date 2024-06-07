<script setup lang="ts">
import { saveName, saveNames } from '~/src/appState'

const sendMessage = useNuxtApp().$sendMessage

function loadSave(event: any) {
  saveName.value = event.target.value
  sendMessage('saveOpen', { name: saveName.value })
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="dropdown-container">
      <label for="my-dropdown">Package</label>
      <vscode-dropdown id="my-dropdown" :value="saveName" class="w-full" @change="(loadSave)">
        <template v-for="value of saveNames" :key="value">
          <vscode-option :selected="value === saveName">
            {{ value }}
          </vscode-option>
        </template>
      </vscode-dropdown>
    </div>
  </div>
</template>

<style>
.vs-input {
  color: var(--vscode-input-foreground);
  background-color: var(--vscode-input-background);

}
</style>
