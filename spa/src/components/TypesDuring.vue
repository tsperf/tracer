<script setup lang="ts">
import { appState } from 'src/appState'
import type { TypeLine } from 'src/traceData'
import { computed } from 'vue'

const props = defineProps<{ ts: number, duration: number }>()

const types = computed(
  () =>
    (appState.data ?? []).filter(
      x => 'id' in x && x.ts >= props.ts && x.ts < props.ts + props.duration,
    ) as TypeLine[],
  // .sort((a, b) => (b.dur ?? 0) - (a.dur ?? 0)),
)
</script>

<template>
  <q-card class="q-pl-md">
    <!-- <q-expansion-item label="types"> -->
    <div>
      Types created: {{ types.length }}
      <!-- <div class="q-pl-md" v-for="type in types" :key="type.id">
          <div class="row justify-between">
            <div class="col-1">ts: {{ Math.round(type.ts ?? 0) }}</div>
            <div class="col-1">dur: {{ Math.round(type.dur ?? 0) }}</div>
            <div class="col-1">id: {{ type.id }}</div>
            <div class="col-1">{{ type.recursionId }}</div>
            <div class="col-8">{{ type.flags }}</div>
          </div>
          <div class="q-pl-md" v-if="type.display">{{ type.display }}</div>
        </div> -->
    </div>
    <!-- </q-expansion-item> -->
  </q-card>
</template>
