<script setup lang="ts">
import TreeNode from './TreeNode.vue'
import type { Tree } from '~/src/traceTree'

const tree = useState<Tree>('traceTree')
</script>

<template>
  <div v-if="tree">
    {{ tree.children.length }}
    {{ tree.children.filter(x => x.children.length > 0).length }}
    <TreeNode :tree="tree" :depth="0" />
  </div>
</template>
