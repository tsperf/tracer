<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import type { TraceLine } from '~/src/traceData'

const props = defineProps<{ line: TraceLine }>()

const vscode = useNuxtApp().$vscode

function goto(fileName: string | undefined, pos: number | undefined) {
  if (!fileName || !pos)
    return
  vscode.postMessage({ message: 'gotoPosition', fileName, pos })
}
</script>

<template>
  <div>
    <div class="column">
      <div class="row">
        <div>
          {{ props.line.name }} :
          {{ Math.round(line.dur ?? 0 / 1000) / 1000 }}
          {{ line.args?.path }}
          : {{ line.args?.pos }}
        </div>
        <vscode-button
          v-if="line.args?.path && line.args?.pos"
          @click="goto(line.args?.path, line.args?.pos)"
        >
          goto
        </vscode-button>
      </div>
    </div>
  </div>
</template>
