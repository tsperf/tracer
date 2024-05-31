<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import type { TraceLine } from '../../shared/src/traceData'

const props = defineProps<{ line: TraceLine }>()

const sendMessage = useNuxtApp().$sendMessage

function goto(fileName: string | undefined, pos: number | undefined) {
  if (!fileName || !pos)
    return

  sendMessage('gotoPosition', { fileName, pos })
}
</script>

<template>
  <span class="mx-auto">
    {{ props.line.name }} :
    {{ Math.round(line.dur ?? 0 / 1000) / 1000 }}
    {{ line.args?.path }}
    {{ line.args?.pos === undefined ? '' : `: ${line.args.pos} - ${line.args?.end}` }}
  </span>
  <UIcon v-if="line.args?.pos !== undefined" primary name="i-heroicons-arrow-left-on-rectangle" @click="goto(line.args?.path, line.args?.pos)" />
  <div v-else />
</template>
