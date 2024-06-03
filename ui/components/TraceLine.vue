<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import type { TraceLine } from '../../shared/src/traceData'

const props = defineProps<{ line: TraceLine }>()
</script>

<template>
  <div class="flex flex-row justify-start gap-2 grow text-left">
    <span>
      {{ props.line.name }}:
    </span><span>
      {{ Math.round(line.dur ?? 0 / 1000) / 1000 }}ms
    </span><span class="grow text-right">
      {{ line.args?.path ?? '' }}
    </span><span>
      {{ line.args?.pos === undefined ? '' : `${line.args.pos} - ${line.args?.end}` }}
    </span>
  </div>
</template>
