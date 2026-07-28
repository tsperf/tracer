<script setup lang="ts">
import type { TraceTypeRef } from '../../shared/src/traceData'

const props = defineProps<{ refs: TraceTypeRef[] }>()

const openRef = ref<string | null>(null)

function toggle(ref: TraceTypeRef) {
  const key = `${ref.key}:${ref.typeId}`
  openRef.value = openRef.value === key ? null : key
}
</script>

<template>
  <div v-if="props.refs.length" class="mt-1 flex flex-col gap-1 rounded border border-dashed border-[var(--vscode-editorWidget-border)] px-2 py-1 text-xs">
    <div class="font-medium opacity-70">
      Type refs
    </div>

    <div v-for="ref in props.refs" :key="`${ref.key}:${ref.typeId}`" class="flex flex-col gap-1">
      <div class="flex items-start gap-2">
        <button
          class="mt-0.5 rounded bg-[var(--vscode-button-background, green)] px-1 py-0.5 text-[var(--vscode-button-foreground, white)] focus:outline-none focus:ring-1 focus:ring-[var(--vscode-focusBorder, blue)]"
          :title="`Go to definition: ${ref.title}`"
          @click="toggle(ref)"
        >
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="relative top-0.5" />
        </button>

        <div class="flex min-w-0 flex-col">
          <span class="truncate" :title="ref.title">
            <span class="opacity-70">{{ ref.key }}</span>:
            <span class="font-medium">{{ ref.label }}</span>
            <span class="opacity-60">#{{ ref.typeId }}</span>
          </span>

          <div v-if="openRef === `${ref.key}:${ref.typeId}` && ref.type" class="pl-1 pt-1">
            <TypeLine :line="ref.type" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
