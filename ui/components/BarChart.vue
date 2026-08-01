<script setup lang="ts">
import type { Tree } from '../../src/traceTree'

const props = defineProps<{ nodes: Tree[] }>()

const chartRef = ref<HTMLElement | null>(null)

const topNodes = computed(() => {
  return [...props.nodes]
    .filter(n => n.line.dur && n.line.dur > 0)
    .sort((a, b) => (b.line.dur ?? 0) - (a.line.dur ?? 0))
    .slice(0, 20)
})

const maxDur = computed(() => {
  if (topNodes.value.length === 0) return 1
  return topNodes.value[0]?.line.dur ?? 1
})

function getBarWidth(dur: number): string {
  return `${(dur / maxDur.value) * 100}%`
}

function getBarColor(dur: number): string {
  const ratio = dur / maxDur.value
  if (ratio > 0.7) return 'rgba(255, 50, 50, 0.7)'
  if (ratio > 0.4) return 'rgba(255, 180, 0, 0.6)'
  return 'rgba(100, 200, 100, 0.5)'
}

function formatDuration(dur: number): string {
  return `${Math.round(dur / 100) / 10}ms`
}
</script>

<template>
  <div ref="chartRef" class="bar-chart">
    <h3 class="text-sm font-semibold mb-2">
      Top 20 Slowest Checks
    </h3>
    <div v-if="topNodes.length === 0" class="text-sm opacity-50">
      No trace data available. Run a trace first.
    </div>
    <div v-for="(node, idx) in topNodes" :key="node.id" class="bar-row flex items-center gap-2 mb-1">
      <span class="bar-rank w-6 text-right text-xs opacity-60">{{ idx + 1 }}</span>
      <span class="bar-name w-40 truncate text-xs" :title="node.line.name">{{ node.line.name }}</span>
      <div class="bar-track flex-1 h-4 rounded-sm bg-[var(--vscode-editor-inactiveSelectionBackground)]">
        <div
          class="bar-fill h-full rounded-sm transition-all duration-300"
          :style="{ width: getBarWidth(node.line.dur ?? 0), backgroundColor: getBarColor(node.line.dur ?? 0) }"
        />
      </div>
      <span class="bar-value w-16 text-right text-xs">{{ formatDuration(node.line.dur ?? 0) }}</span>
      <span class="bar-types w-20 text-right text-xs opacity-60">
        {{ node.typeCnt }}{{ node.childTypeCnt ? `/${node.childTypeCnt + node.typeCnt}` : '' }} types
      </span>
    </div>
  </div>
</template>

<style scoped>
.bar-chart {
  padding: 8px;
}
.bar-row:hover {
  background-color: var(--vscode-list-hoverBackground);
}
</style>
