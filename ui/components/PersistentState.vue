<script setup lang="ts">
const sendMessage = useNuxtApp().$sendMessage

const Messages = useNuxtApp().$Messages

const projectName = ref('')
const saveName = ref('default')

const projectNames = ref([] as string[])
const saveNames = ref([] as string[])

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

function loadSave() {
  sendMessage('saveOpen', { name: saveName.value })
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <VTextField v-model="projectName" label="Project Name" readonly />
    <ULabled label="Save Name">
      <USelectMenu v-model="saveName" :options="saveNames" searchable clear-search-on-close creatable class="min-w-48" @change="loadSave">
        <template #option-create="{ option }">
          <span class="flex-shrink-0">New save:</span>
          <span class="block truncate">{{ option }} </span>
        </template>
      </USelectMenu>
    </ULabled>
    <!-- <div class="flex flex-row items-center text-center justify-between">
      <vscode-button @click="manualSave">
        Save
      </vscode-button>
      <vscode-button>
        Load
      </vscode-button>
    </div> -->
  </div>
</template>
