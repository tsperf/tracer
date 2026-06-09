<script setup lang="ts">
import type { TraceSeverity, TypeLine } from '../../shared/src/traceData'

const props = defineProps<{ line: TypeLine }>()
function severityClass(severity: TraceSeverity | undefined) {
  return {
    error: 'text-[var(--vscode-errorForeground)]',
    warning: 'text-[var(--vscode-editorWarning-foreground)]',
    info: 'text-[var(--vscode-editorInfo-foreground)]',
  }[severity ?? '']
}
</script>

<template>
  <UContainer class="border">
    <div class="flex flex-row justify-start gap-x-2">
      <div class="col-1">
        ts: {{ Math.round(line.ts ?? 0) }}
      </div>
      <div class="col-1" :class="severityClass(line.timeSeverity)">
        dur: {{ Math.round(line.dur ?? 0) }}
      </div>
      <div class="col-1">
        id: {{ line.id }}
      </div>
      <div class="col-1">
        {{ line.recursionId }}
      </div>
      <div class="col-8">
        {{ line.flags }}
      </div>
    </div>
    <div v-if="line.display" class="q-pl-md">
      {{ props.line.display }}
    </div>
  </UContainer>
</template>
