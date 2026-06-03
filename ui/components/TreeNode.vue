<script setup lang="ts">
import type { Tree } from '../../src/traceTree'
import { childrenById, typesById } from '~/src/appState'

const props = defineProps<{ tree: Tree, depth: number }>()

const sendMessage = useNuxtApp().$sendMessage

const children = computed(() => childrenById.get(props.tree.id) ?? [])
const types = computed(() => typesById.get(props.tree.id) ?? [])

function fetchChildren() {
  if (children.value.length === 0)
    sendMessage('childrenById', { id: props.tree.id })
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

// Visual tone: color based on duration
function getDurationColor(dur: number | undefined): string {
  if (!dur || dur <= 0) return 'transparent'
  const ms = dur / 1000
  if (ms > 10) return 'rgba(255, 50, 50, 0.15)'
  if (ms > 5) return 'rgba(255, 180, 0, 0.12)'
  if (ms > 1) return 'rgba(100, 200, 100, 0.08)'
  return 'transparent'
}

function formatDuration(dur: number | undefined): string {
  if (!dur) return '0ms'
  return `${Math.round(dur / 100) / 10}ms`
}

// Duration bar width (relative to max)
const maxDur = 10_000_000 // 10s as reference
function getDurationBarWidth(dur: number | undefined): string {
  if (!dur) return '0%'
  const pct = Math.min((dur / maxDur) * 100, 100)
  return `${pct}%`
}
</script>

<template>
  <div class="m-0 p-0 flex flex-col gap-0 justify-start w-screen tree-node" :style="{ backgroundColor: getDurationColor(tree.line.dur) }">
    <UExpand class="w-full min-h-1.5" :expandable="tree.childCnt > 0" @expand="fetchChildren">
      <template #inset>
        <template v-for="n in depth" :key="n">
          <div :class="insetClass" />
        </template>
      </template>
      <template #label>
        <div class="flex flex-row gap-3 w-full pl-1 items-center">
          <div class="flex flex-row justify-start gap-2 grow text-left items-center">
            <span class="min-w-40 truncate" :title="tree.line.name">
              {{ tree.line.name }} ({{ tree.childCnt }}):
            </span>
            <!-- Duration with visual bar -->
            <div class="flex items-center gap-1 min-w-32">
              <span class="text-xs font-mono">{{ formatDuration(tree.line.dur) }}</span>
              <div class="duration-bar-track h-1.5 flex-1 rounded-full bg-[var(--vscode-editor-inactiveSelectionBackground)]">
                <div
                  class="duration-bar-fill h-full rounded-full"
                  :style="{
                    width: getDurationBarWidth(tree.line.dur),
                    backgroundColor: tree.line.dur && tree.line.dur > 10_000_000 ? 'rgba(255,50,50,0.8)' : tree.line.dur && tree.line.dur > 5_000_000 ? 'rgba(255,180,0,0.7)' : 'rgba(100,200,100,0.5)'
                  }"
                />
              </div>
            </div>
            <span class="text-right text-xs opacity-60 truncate max-w-40" :title="tree.line.args?.path ?? ''">
              {{ tree.line.args?.path ?? '' }}
            </span>
          </div>
          <div class="flex flex-row min-w-40 items-center">
            <button v-if="'args' in tree.line && tree.line.args?.pos !== undefined" class="mr-2 p-0.5 bg-[var(--vscode-button-background, green)] rounded-sm focus:ring-[var(--vscode-focusBorder, blue)] focus:outline-none focus:ring-1" @click="gotoPosition">
              <UIcon primary name="i-heroicons-arrow-left-on-rectangle" class="relative top-0.5 hover:backdrop-invert-[10%] hover:invert-[20%] bg-[var(--vscode-button-foreground, white)]" size="12" />
            </button>
            <div v-else />
            <span class="text-xs">{{ tree.line.args?.pos === undefined ? '' : `${tree.line.args.pos} - ${tree.line.args?.end}` }}</span>
          </div>

          <div class="flex flex-row justify-self-end justify-evenly">
            <UExpand v-if="props.tree.typeCnt > 0" class="min-w-40" @expand="fetchTypes">
              <template #label>
                <span class="pl-1 text-xs">{{ `Types: ${props.tree.typeCnt}` }} {{ `${props.tree.childTypeCnt || props.tree.typeCnt ? `/ ${props.tree.childTypeCnt + props.tree.typeCnt}` : ''}` }}</span>
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
    </UExpand>
  </div>
</template>

<style scoped>
.tree-node {
  transition: background-color 0.2s;
}
.tree-node:hover {
  background-color: var(--vscode-list-hoverBackground) !important;
}
.duration-bar-track {
  min-width: 60px;
}
</style>
