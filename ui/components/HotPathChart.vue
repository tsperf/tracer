<script setup lang="ts">
import type { HotPathNode } from '../../shared/src/messages'

const props = defineProps<{ nodes: HotPathNode[] }>()
const emit = defineEmits<{ (e: 'goto-position', node: HotPathNode): void }>()

const maxDur = computed(() => Math.max(1, ...props.nodes.map(node => node.dur)))

function barWidth(node: HotPathNode) {
  return `${Math.max(2, (node.dur / maxDur.value) * 100)}%`
}

function typeWidth(count: number, total: number) {
  if (total <= 0)
    return '0%'

  return `${(count / total) * 100}%`
}

function durationMs(dur: number) {
  return `${(dur / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}ms`
}

function locationText(node: HotPathNode) {
  if (!node.path)
    return ''

  if (node.pos === undefined)
    return node.path

  return `${node.path}:${node.pos}`
}
</script>

<template>
  <div class="ml-6 mr-4 my-1 border-l border-[var(--vscode-tree-indentGuidesStroke)] pl-3 text-xs">
    <div v-if="nodes.length === 0" class="py-2 opacity-70">
      Loading hot path...
    </div>
    <div v-else class="flex flex-col gap-1 py-1">
      <div class="flex flex-row gap-4 opacity-70">
        <span>Longest child path</span>
        <span>blue: duration</span>
        <span>yellow: local types</span>
        <span>purple: child types</span>
      </div>
      <div v-for="(node, index) of nodes" :key="node.id" class="flex flex-row items-center gap-2 min-h-8">
        <span class="w-12 text-right tabular-nums opacity-80">#{{ index + 1 }}</span>
        <span class="w-20 text-right tabular-nums">{{ durationMs(node.dur) }}</span>
        <div class="min-w-0 grow">
          <div class="relative h-6 overflow-hidden border border-[var(--vscode-panel-border)]">
            <div
              class="absolute left-0 top-0 h-full bg-[var(--vscode-charts-blue,#3794ff)] opacity-40"
              :style="{ width: barWidth(node) }"
            />
            <div class="relative z-10 flex h-full flex-row items-center gap-3 px-2">
              <span class="min-w-0 grow truncate" :title="node.name">{{ node.name }}</span>
              <span class="shrink-0 tabular-nums">{{ node.totalTypeCnt }} types</span>
              <span class="shrink-0 tabular-nums">{{ node.childCnt }} children</span>
            </div>
          </div>
          <div v-if="node.totalTypeCnt > 0" class="mt-0.5 flex h-1 overflow-hidden">
            <div
              class="bg-[var(--vscode-charts-yellow,#cca700)]"
              :style="{ width: typeWidth(node.typeCnt, node.totalTypeCnt) }"
            />
            <div
              class="bg-[var(--vscode-charts-purple,#b180d7)]"
              :style="{ width: typeWidth(node.childTypeCnt, node.totalTypeCnt) }"
            />
          </div>
        </div>
        <span class="w-56 truncate opacity-70" :title="locationText(node)">{{ locationText(node) }}</span>
        <button
          v-if="node.path && node.pos !== undefined"
          class="mb-1 shrink-0 bg-[var(--vscode-button-background,green)] rounded-sm focus:ring-[var(--vscode-focusBorder,blue)] focus:outline-none focus:ring-1"
          title="Go to source position"
          @click="emit('goto-position', node)"
        >
          <UIcon primary name="i-heroicons-arrow-left-on-rectangle" class="relative top-1 hover:backdrop-invert-[10%] hover:invert-[20%] bg-[var(--vscode-button-foreground,white)]" />
        </button>
      </div>
    </div>
  </div>
</template>
