<script setup lang="ts">
import type { TypeLine } from '~/src/traceData'

const props = defineProps<{ line: TypeLine }>()
</script>

<template>
  <q-card class="q-pl-md">
    <div class="row justify-between">
      <div class="col-1">
        ts: {{ Math.round(line.ts ?? 0) }}
      </div>
      <div class="col-1">
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
  </q-card>
</template>
