<script setup lang="ts">
import type { TraceSuggestion } from '../../shared/src/messages'

const props = defineProps<{ suggestions: TraceSuggestion[] }>()

const sendMessage = useNuxtApp().$sendMessage

function gotoSuggestion(suggestion: TraceSuggestion) {
  if (!suggestion.fileName || suggestion.pos === undefined)
    return

  sendMessage('gotoPosition', { fileName: suggestion.fileName, pos: suggestion.pos })
}
</script>

<template>
  <UExpand v-if="props.suggestions.length" class="w-full" :expandable="true">
    <template #label>
      <span class="pl-1">{{ `Suggestions: ${props.suggestions.length}` }}</span>
    </template>
    <div class="flex flex-col gap-2 rounded border border-dashed border-[var(--vscode-editorWidget-border)] p-2">
      <div v-for="suggestion in props.suggestions" :key="`${suggestion.kind}:${suggestion.nodeId}`" class="flex flex-row gap-2 rounded bg-[var(--vscode-editor-background)] px-2 py-1">
        <button
          v-if="suggestion.fileName && suggestion.pos !== undefined"
          class="h-6 rounded bg-[var(--vscode-button-background, green)] px-1 text-[var(--vscode-button-foreground, white)] focus:outline-none focus:ring-1 focus:ring-[var(--vscode-focusBorder, blue)]"
          :title="`Go to ${suggestion.fileName}:${suggestion.pos}`"
          @click="gotoSuggestion(suggestion)"
        >
          <UIcon name="i-heroicons-arrow-left-on-rectangle" class="relative top-0.5" />
        </button>
        <div v-else class="w-6" />

        <div class="min-w-0 flex-1">
          <div class="flex flex-row items-center gap-2">
            <span class="rounded px-1 text-[11px] uppercase tracking-wide opacity-70">
              {{ suggestion.severity }}
            </span>
            <span class="font-medium">
              {{ suggestion.title }}
            </span>
          </div>
          <div class="text-xs opacity-80">
            {{ suggestion.detail }}
          </div>
          <div class="text-[11px] opacity-60">
            {{ suggestion.traceName }}<span v-if="suggestion.fileName"> · {{ suggestion.fileName }}<span v-if="suggestion.pos !== undefined">:{{ suggestion.pos }}</span></span>
          </div>
        </div>
      </div>
    </div>
  </UExpand>
</template>
