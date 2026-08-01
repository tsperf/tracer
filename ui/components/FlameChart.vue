<script setup lang="ts">
import type { Tree } from '../../src/traceTree'

const props = defineProps<{ nodes: Tree[] }>()

interface FlameNode {
  name: string
  value: number
  children: FlameNode[]
  id: number
  fileName: string
  pos: number | undefined
}

const sendMessage = useNuxtApp().$sendMessage

function treeToFlame(tree: Tree): FlameNode {
  return {
    name: tree.line.name || 'root',
    value: tree.line.dur ?? 0,
    children: tree.children.map(treeToFlame),
    id: tree.id,
    fileName: tree.line.args?.path ?? '',
    pos: tree.line.args?.pos,
  }
}

const flameData = computed(() => {
  return props.nodes.map(treeToFlame)
})

const hoveredNode = ref<FlameNode | null>(null)
const selectedDepth = ref(0)

function getMaxDepth(nodes: FlameNode[], depth = 0): number {
  if (nodes.length === 0) return depth
  return Math.max(...nodes.map(n => getMaxDepth(n.children, depth + 1)))
}

function flattenForRender(nodes: FlameNode[], depth = 0, start = 0): Array<{ node: FlameNode, depth: number, start: number, width: number }> {
  const result: Array<{ node: FlameNode, depth: number, start: number, width: number }> = []
  let currentStart = start
  for (const node of nodes) {
    const width = node.value
    result.push({ node, depth, start: currentStart, width })
    result.push(...flattenForRender(node.children, depth + 1, currentStart))
    currentStart += width
  }
  return result
}

const totalWidth = computed(() => {
  return flameData.value.reduce((sum, n) => sum + n.value, 0) || 1
})

const flattened = computed(() => {
  return flattenForRender(flameData.value)
})

function getBlockStyle(item: { node: FlameNode, depth: number, start: number, width: number }) {
  return {
    left: `${(item.start / totalWidth.value) * 100}%`,
    width: `${(item.width / totalWidth.value) * 100}%`,
    top: `${item.depth * 22}px`,
    height: '20px',
  }
}

function getBlockColor(depth: number, value: number): string {
  const maxDur = flameData.value.length > 0 ? Math.max(...flameData.value.map(n => n.value)) : 1
  const intensity = value / maxDur
  const hue = 120 - intensity * 120 // green to red
  return `hsla(${hue}, 70%, 50%, 0.8)`
}

function formatDuration(dur: number): string {
  return `${Math.round(dur / 100) / 10}ms`
}

function goToPosition(node: FlameNode) {
  if (node.fileName && node.pos !== undefined) {
    sendMessage('gotoPosition', { fileName: node.fileName, pos: node.pos })
  }
}
</script>

<template>
  <div class="flame-chart">
    <h3 class="text-sm font-semibold mb-2">
      Flame Chart
    </h3>
    <div v-if="flameData.length === 0" class="text-sm opacity-50">
      No trace data available. Run a trace first.
    </div>
    <div v-else class="flame-container" :style="{ height: `${(getMaxDepth(flameData) + 1) * 22 + 4}px` }">
      <div
        v-for="item in flattened"
        :key="`${item.node.id}-${item.depth}`"
        class="flame-block"
        :style="{ ...getBlockStyle(item), backgroundColor: getBlockColor(item.depth, item.node.value) }"
        :title="`${item.node.name}: ${formatDuration(item.node.value)}`"
        @click="goToPosition(item.node)"
        @mouseenter="hoveredNode = item.node"
        @mouseleave="hoveredNode = null"
      >
        <span class="flame-label truncate text-[10px] leading-5 px-1">
          {{ item.node.name }} {{ formatDuration(item.node.value) }}
        </span>
      </div>
    </div>
    <div v-if="hoveredNode" class="flame-tooltip">
      <strong>{{ hoveredNode.name }}</strong><br>
      Duration: {{ formatDuration(hoveredNode.value) }}<br>
      <span v-if="hoveredNode.fileName">File: {{ hoveredNode.fileName }}</span>
    </div>
  </div>
</template>

<style scoped>
.flame-chart {
  padding: 8px;
}
.flame-container {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
}
.flame-block {
  position: absolute;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  overflow: hidden;
  transition: opacity 0.15s;
}
.flame-block:hover {
  opacity: 0.8;
  border-color: white;
}
.flame-label {
  display: block;
  white-space: nowrap;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.flame-tooltip {
  position: fixed;
  bottom: 8px;
  left: 8px;
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-editorWidget-border);
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 100;
}
</style>
