<script setup lang="ts">
import type { Tree } from '../../src/traceTree'
import { childrenById, childrenTotalById, typesById } from '~/src/appState'

const props = defineProps<{ tree: Tree, depth: number }>()

const sendMessage = useNuxtApp().$sendMessage

const children = computed(() => childrenById.get(props.tree.id) ?? [])
const totalChildren = computed(() => childrenTotalById.get(props.tree.id))
const types = computed(() => typesById.get(props.tree.id) ?? [])

// Pagination state
const offset = ref(0)
const limit = 50

function fetchChildren() {
  if (children.value.length === 0)
    sendMessage('childrenById', { id: props.tree.id, limit, offset: offset.value })
}

function loadMoreChildren() {
  // Load next batch of children
  const newOffset = offset.value + limit
  offset.value = newOffset
  sendMessage('childrenById', { id: props.tree.id, limit, offset: newOffset })
}

function fetchTypes() {
  if (types.value.length === 0)
    sendMessage('typesById', { id: props.tree.id })
}

function gotoPosition() {
  if ('name' in props.tree.line) {
    const { path, pos } = props.tree.line.args ?? { path: undefined, pos: undefined }
    if (!path || !pos)
      return

    sendMessage('gotoPosition', { fileName: path, pos })
  }
}

const insetClass = `border-e min-w-2 border-[var(--vscode-tree-inactiveIndentGuidesStroke)] hover:border-[var(--vscode-tree-indentGuidesStroke)]`
</script>

<template>
  <div class="m-0 p-0 flex flex-col gap-0 justify-start w-screen ">
    <UExpand class="w-full min-h-1.5" :expandable="tree.childCnt > 0" @expand="fetchChildren">
      <template #inset>
        <template v-for="n in depth" :key="n">
          <div :class="insetClass" />
        </template>
        <!-- <div :class="insetClass" :style="{ minWidth: `${props.depth / 2}rem` }" /> -->
      </template>
      <template #label>
        <div class="flex flex-row gap-5 w-full pl-1">
          <div class="flex flex-row justify-start gap-2 grow text-left">
            <span class="min-w-48">
              {{ tree.line.name }} ({{ tree.childCnt }}):
            </span><span>
              {{ Math.round(props.tree.line.dur ?? 0 / 1000) / 1000 }}ms
            </span>
            <div class="grow opacity-20 hover:opacity-100 h-full">
              <div class="mt-4 border-b border-dashed border-[var(--vscode-tree-indentGuidesStroke)]" />
            </div>
            <span class="text-right">
              {{ tree.line.args?.path ?? '' }}
            </span>
          </div>
          <div class="flex flex-row min-w-40">
            <button v-if="'args' in tree.line && tree.line.args?.pos !== undefined" class="mr-2 pb-1 mb-1 bg-[var(--vscode-button-background, green)] rounded-sm focus:ring-[var(--vscode-focusBorder, blue)] focus:outline-none focus:ring-1 " @click="gotoPosition">
              <UIcon primary name="i-heroicons-arrow-left-on-rectangle" class="relative top-1  hover:backdrop-invert-[10%] hover:invert-[20%] bg-[var(--vscode-button-foreground, white)] " />
            </button>
            <div v-else />
            <span>{{ tree.line.args?.pos === undefined ? '' : `${tree.line.args.pos} - ${tree.line.args?.end}` }}</span>
          </div>

          <div class="flex flex-row justify-self-end justify-evenly">
            <UExpand v-if="props.tree.typeCnt > 0" class="min-w-40" @expand="fetchTypes">
              <template #label>
                <span class="pl-1">{{ `Types: ${props.tree.typeCnt}` }} {{ `${props.tree.childTypeCnt || props.tree.typeCnt ? `/ ${props.tree.childTypeCnt + props.tree.typeCnt}` : ''}` }}</span>
              </template>
              <TypeTable class="relative -left-auto right-auto" :types="types" />
            </UExpand>
            <div v-else class="min-w-40" />
          </div>
        </div>
      </template>
      <template v-for="(node, idx) of children" :key="idx">
        <TreeNode :depth="depth + 1" :tree="node" />
      </template>
      <div v-if="totalChildren !== undefined && children.length + offset < totalChildren" class="flex justify-center py-2 pl-8">
        <button class="px-4 py-1 bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] rounded hover:opacity-80 transition-opacity text-sm" @click="loadMoreChildren">
          Load More ({{ children.length + offset }}/{{ totalChildren }})
        </button>
      </div>
    </UExpand>
  </div>
</template>
