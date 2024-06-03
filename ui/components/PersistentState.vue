<script setup lang="ts">
const sendMessage = useNuxtApp().$sendMessage

const Messages = useNuxtApp().$Messages

const projectName = ref('')
const saveName = ref('default')

const projectNames = ref([] as string[])
const saveNames = ref([] as string[])

if (!saveNames.value.includes('default'))
  saveNames.value.unshift('default')

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  switch (parsed.data.message) {
    case 'projectNames':
      projectNames.value = parsed.data.names
      break

    case 'saveNames':
      saveNames.value = parsed.data.names
      break

    case 'saveOpen': {
      saveName.value = parsed.data.name
      break
    }

    case 'projectOpen': {
      projectName.value = parsed.data.name
      break
    }
  }
}

// function loadProject() {
//   sendMessage('projectOpen', { name: projectName.value })
// }

function loadSave(event: any) {
  saveName.value = event.target.value
  sendMessage('saveOpen', { name: saveName.value })
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <VTextField v-model="projectName" label="Project Name" readonly />
    <div class="dropdown-container">
      <label for="my-dropdown">Save Name  </label>
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
