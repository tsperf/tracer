<script setup lang="ts">
import type { Tree } from '~/src/traceTree'
import type { TypeLine as TypeLineType } from '~/src/traceData'

const props = defineProps<{ tree: Tree, depth: number }>()

const children = computed(() => (props.depth === 0 ? props.tree.children.filter(x => x.children.length > 0) : props.tree.children).sort((a, b) => (b.line.dur ?? 0) - (a.line.dur ?? 0)))

function typesInNode(x: Tree): number {
  return x.children.filter(x => 'id' in x.line).length + x.children.map(typesInNode).reduce((a, b) => a + b, 0)
}

const typeCnt = computed(() => children.value.filter(x => 'id' in x.line).length)
const totalTypeCnt = computed(() => children.value.map(typesInNode).reduce((a, b) => a + b, 0) + typeCnt.value)
</script>

<template>
  <div class="pl-3 ">
    <!-- children: {{ tree.children.length }} -->
    <TraceLine v-if="'name' in tree.line" :line="tree.line" />
    <TypeLine v-else :line="props.tree.line as TypeLineType" />
    <div v-if="typeCnt || totalTypeCnt">
      Types Created: {{ typeCnt }} / {{ totalTypeCnt }}
    </div>
    <template v-for="(node, idx) of children" :key="idx">
      <TreeNode :depth="depth + 1" :tree="node" />
    </template>
  </div>
</template>
