<script setup lang="ts">
import { files, traceTree } from '~/src/fileState'

const sendMessage = useNuxtApp().$sendMessage

function log(...values: any[]) {
  sendMessage({ message: 'log', value: values })
}

const forage = useLocalForage()

const projectName = ref('')
const saveName = ref('default')

const projectNames = shallowRef([] as string[])
const saveNames = shallowRef([] as string[])

async function loadMeta() {
  projectNames.value = (await forage.getItem('projectNames')) ?? []
  if (!projectName.value)
    projectName.value = (await forage.getItem('projectName')) ?? ''
}

function key(name: string) {
  return `${projectName.value}::${name}`
}

function saveKey(name: string) {
  return `${projectName.value}::${saveName.value}::${name}`
}

async function loadProject(selectedProjectName: string) {
  selectedProjectName ??= projectName.value
  if (!selectedProjectName)
    return

  log('loadProject', selectedProjectName)

  if (!(projectNames.value.includes(selectedProjectName))) {
    projectNames.value.push(selectedProjectName)
    await forage.setItem('projectNames', [...projectNames.value])
    log('Added Project', selectedProjectName)
  }

  saveNames.value = (await forage.getItem(key('saveNames'))) ?? []
  saveName.value = (await forage.getItem(key('saveName'))) ?? 'default'

  loadSave()
}

async function loadSave() {
  if (!projectName.value || !saveName.value)
    return

  if (!(saveNames.value.includes(saveName.value))) {
    saveNames.value.push(saveName.value)
    await forage.setItem(key('saveNames'), [...saveNames.value])
  }

  files.value = (await forage.getItem(saveKey('files'))) ?? {}
  traceTree.value = (await forage.getItem(saveKey('tree'))) ?? undefined
}

function watchState() {
  watch(files, async (value) => {
    if (projectName.value && saveName)
      await forage.setItem(saveKey('files'), value)
  })

  watch(traceTree, async (value) => {
    if (projectName.value && saveName)
      await forage.setItem(saveKey('tree'), value)
  })
}

// function manualSave() {
// }

onMounted(() => {
  loadMeta()
  watchState()
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <ULabled label="Project Name">
      <USelectMenu v-model="projectName" :options="projectNames" searchable clear-search-on-close creatable class="min-w-48" @change="loadProject" />
    </ULabled>
    <ULabled label="Save Name">
      <USelectMenu v-model="saveName" :options="saveNames" searchable clear-search-on-close creatable class="min-w-48" @change="loadSave" />
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
