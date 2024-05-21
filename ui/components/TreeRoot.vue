<script setup lang="ts">
import * as Messages from '../../messages/src/messages'
import TreeNode from './TreeNode.vue'
import { type Tree, typesInNode } from '~/src/traceTree'
import type { TraceLine } from '~/src/traceData'

const sendMessage = useNuxtApp().$sendMessage

const tree = useState<Tree>('traceTree')

const filters = useState<{
  startsWith: string
  sourceFileName: string
  position: number
}>('treeFilters')

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  if (parsed.data.message === 'fileStats') {
    filters.value.startsWith = 'check'
    filters.value.sourceFileName = parsed.data.fileName
    filters.value.position = 0

    const fileName = parsed.data.fileName
    nextTick(() => {
      const stats: typeof parsed.data.stats = []
      function visit(node: Tree) {
        if ('name' in node.line) {
          const line = node.line as TraceLine
          if (
            line.dur
            && line.args?.path
            && line.args.path === fileName
            && line.args?.pos
            && line.args?.end
          ) {
            stats.push({
              dur: line.dur,
              pos: line.args.pos,
              end: line.args.end,
              types: node.children.filter(x => 'id' in x.line).length,
              totalTypes: typesInNode(node),
            })
          }
        }
        node.children.forEach(visit)
      }

      visit(tree.value)
      sendMessage({
        message: 'fileStats',
        fileName,
        stats,
      })
    })
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <UContainer v-if="tree">
    {{ tree.children.length }}
    {{ tree.children.filter((x) => x.children.length > 0).length }}
    <TreeNode :tree="tree" :depth="0" :is-in-check="false" />
  </UContainer>
</template>
