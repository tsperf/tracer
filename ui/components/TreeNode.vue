<script setup lang="ts">
import type { Tree } from '~/src/traceTree'

const props = defineProps<{ tree: Tree, depth: number, isInCheck: boolean }>()

const children = computed(() => {
  const arr = props.depth === 0 ? props.tree.children.filter(x => x.children.length > 0) : props.tree.children
  const tree = arr.sort((a, b) => (b.line.dur ?? 0) - (a.line.dur ?? 0))
  return { tree }
})

const filters = useState<{ startsWith: string, sourceFileName: string, position: number }>('treeFilters')

const show = computed(() =>
  props.isInCheck
  || (('name' in props.tree.line && props.tree.line.name.startsWith(filters.value.startsWith))
  && (!filters.value.sourceFileName || ((props.tree.line.args?.path ?? '').endsWith(filters.value.sourceFileName)))
  && (!(filters.value.position > 0) || ((props.tree.line.args?.pos ?? 0) === filters.value.position))
  ),
)
</script>

<template>
  <div class="pl-3 ">
    <template v-if="show">
      <!-- children: {{ tree.children.length }} -->
      <TraceLine v-if="'name' in tree.line" :line="tree.line" />
      <UExpand v-if="children.tree.length > 0" :label=" `Children: ${children.tree.length} ${props.tree.childTypeCnt || props.tree.types.length ? `Types: ${props.tree.childTypeCnt + props.tree.types.length}` : ''}`" class="border">
        <template v-for="(node, idx) of children.tree" :key="idx">
          <TreeNode v-if="'name' in tree.line" :depth="depth + 1" :tree="node" :is-in-check="show" />
        </template>
      </Uexpand>
      <UExpand v-if="props.tree.types.length > 0" :label="`Types: ${props.tree.types.length}`">
        <TypeTable :types="props.tree.types" />
      </UExpand>
    </template>
    <template v-else>
      <template v-for="(node, idx) of children.tree" :key="idx">
        <TreeNode v-if="'name' in tree.line" :depth="depth + 1" :tree="node" :is-in-check="false" />
      </template>
    </template>
  </div>
</template>
