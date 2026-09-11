<script setup lang="ts">
import type { TypeLine } from '../../shared/src/traceData'

const props = defineProps<{ types: TypeLine[] }>()
</script>

<template>
  <div class="p-1">
    <div class="flex items-center justify-between px-3 py-2 mb-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium">
      <span>⚡ Type Complexity Metrics</span>
      <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">v1.0 Trace Viewer</span>
    </div>
  <div>
    <UTable :rows="props.types" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'fetching ...' }" />
  </div>
  </div>
</template>
