<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import type { TraceLine } from '~/src/traceData'

const props = defineProps<{ line: TraceLine }>()

const sendMessage = useNuxtApp().$sendMessage

function goto(fileName: string | undefined, pos: number | undefined) {
  if (!fileName || !pos)
    return

  sendMessage({ message: 'gotoPosition', fileName, pos })
}
</script>

<template>
  <div>
    <div class="column">
      <div class="flex flex-row">
        <div>
          {{ props.line.name }} :
          {{ Math.round(line.dur ?? 0 / 1000) / 1000 }}
          {{ line.args?.path }}
          : {{ line.args?.pos }}
          - {{ line.args?.end }}
        </div>
        <UIcon primary name="i-heroicons-arrow-left-on-rectangle" @click="goto(line.args?.path, line.args?.pos)" />
      </div>
    </div>
  </div>
</template>
