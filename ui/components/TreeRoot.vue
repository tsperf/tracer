// TODO:  handle receiving an array of trees to display here
<script setup lang="ts">
import type { Tree } from '../../shared/src/traceTree'
import TreeNode from './TreeNode.vue'

const Messages = useNuxtApp().$Messages

const nodes = ref([] as Tree[])

function handleMessage(e: MessageEvent<unknown>) {
  const message = Messages.message.safeParse(e.data)
  if (!message.success)
    return

  if (message.data.message === 'showTree')
    nodes.value = message.data.nodes
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <UContainer>
    <template v-for="tree of nodes" :key="tree.id">
      <TreeNode :tree="tree" :depth="0" :is-in-check="false" />
    </template>
  </UContainer>
</template>
