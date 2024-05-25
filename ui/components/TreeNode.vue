// TODO: on expand post message getTreeByID and handle receiving a result of the tree to expand
<script setup lang="ts">
import type { Tree } from '../../shared/src/traceTree'

const props = defineProps<{ tree: Tree, depth: number }>()
</script>

<template>
  <div class="pl-3 ">
    <!-- children: {{ tree.children.length }} -->
    <TraceLine v-if="'name' in tree.line" :line="tree.line" />
    <UExpand v-if="props.tree.children.length > 0" :label=" `Children: ${props.tree.children.length} ${props.tree.childTypeCnt || props.tree.types.length ? `Types: ${props.tree.childTypeCnt + props.tree.types.length}` : ''}`" class="border">
      <template v-for="(node, idx) of props.tree.children" :key="idx">
        <TreeNode v-if="'name' in tree.line" :depth="depth + 1" :tree="node" />
      </template>
    </Uexpand>
    <UExpand v-if="props.tree.types.length > 0" :label="`Types: ${props.tree.types.length}`">
      <TypeTable :types="props.tree.types" />
    </UExpand>
  </div>
</template>
