<script setup lang="ts">
import type { Tree } from '~/src/traceTree'
import type { TypeLine } from '~/src/traceData'

const props = defineProps<{ tree: Tree, depth: number, isInCheck: boolean }>()

const children = computed(() => {
  const arr = props.depth === 0 ? props.tree.children.filter(x => x.children.length > 0) : props.tree.children
  const tree = arr.sort((a, b) => (b.line.dur ?? 0) - (a.line.dur ?? 0))
  const types = arr.filter(x => 'id' in x.line).map(x => x.line) as TypeLine[]
  return { tree, types }
})

function typesInNode(x: Tree): number {
  return x.children.filter(x => 'id' in x.line).length + x.children.map(typesInNode).reduce((a, b) => a + b, 0)
}

const show = props.isInCheck || ('name' in props.tree.line && props.tree.line.name.startsWith('check'))

const typeCnt = computed(() => children.value.types.length)
const childrenTypeCnt = computed(() => children.value.tree.map(typesInNode).reduce((a, b) => a + b, 0))
</script>

<template>
  <div class="pl-3 ">
    <template v-if="show">
      <!-- children: {{ tree.children.length }} -->
      <TraceLine v-if="'name' in tree.line" :line="tree.line" />
      <UExpand v-if="children.tree.length > typeCnt" :label=" `Children: ${children.tree.length - typeCnt} ${childrenTypeCnt ? `Types: ${childrenTypeCnt}` : ''}`" class="border">
        <template v-for="(node, idx) of children.tree" :key="idx">
          <TreeNode v-if="'name' in tree.line" :depth="depth + 1" :tree="node" :is-in-check="show" />
        </template>
      </Uexpand>
      <UExpand v-if="typeCnt > 0" :label="`Types: ${typeCnt}`">
        <TypeTable :types="children.types" />
      </UExpand>
    </template>
    <template v-else>
      <template v-for="(node, idx) of children.tree" :key="idx">
        <TreeNode v-if="'name' in tree.line" :depth="depth + 1" :tree="node" :is-in-check="false" />
      </template>
    </template>
  </div>
</template>
