// TODO:  handle receiving an array of trees to display here
<script setup lang="ts">
import type { Tree } from '../../shared/src/traceTree'
import TreeNode from './TreeNode.vue'

const props = defineProps<{ sortBy: 'Timestamp' | 'Duration' | 'Types' | 'Total Types' }>()

const Messages = useNuxtApp().$Messages

const sortValue: Record<typeof props.sortBy, (t: Tree) => number> = {
  'Timestamp': t => t.line.ts,
  'Duration': t => -(t.line.dur ?? 0),
  'Types': t => -t.typeCnt,
  'Total Types': t => -(t.childTypeCnt + t.typeCnt),
} as const

const nodes = ref([] as Tree[])

function doSort() {
  const val = props.sortBy ?? 'Timestamp'
  const ord = sortValue[val]
  nodes.value = nodes.value.toSorted((a, b) => ord(a) - ord(b))
}

function handleMessage(e: MessageEvent<unknown>) {
  const message = Messages.message.safeParse(e.data)
  if (!message.success)
    return

  if (message.data.message === 'showTree') {
    switch (message.data.step) {
      case 'start':
        nodes.value = []
        break
      case 'add':
        nodes.value.push(...message.data.nodes)
        break
      case 'done':
        doSort()
        break
    }
  }
}

const lastSortBy = props.sortBy
onUpdated(() => {
  if (lastSortBy !== props.sortBy)
    doSort()
})

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
