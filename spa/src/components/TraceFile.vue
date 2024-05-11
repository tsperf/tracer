<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import { appState } from 'src/appState'
import { trpc } from 'src/trpcRouter'
import { computed, ref } from 'vue'
import TypesDuring from 'components/TypesDuring.vue'
import type { TraceLine } from 'src/traceData'

const names = computed(() => {
  if (appState.data === undefined)
    return []

  const names = new Set<string>()
  for (const line of appState.data) {
    if ('name' in line)
      names.add(line.name)
  }

  return [...names.values()].sort()
})

const selectedName = ref('checkExpression')

const selectedLines = computed(
  () =>
    appState.data
      ?.filter(
        x =>
          'name' in x && x.name === selectedName.value && (x.dur ?? 0) !== 0,
      )
      .sort((a, b) => b.dur! - a.dur!)
      .slice(0, 50) as TraceLine[],
)

function goto(fileName: string | undefined, pos: number | undefined) {
  if (!fileName || !pos)
    return
  trpc.gotoPosition.query({ fileName, pos })
}
</script>

<template>
  <div>
    <q-select v-model="selectedName" label="Name" :options="names" />
    <div class="column">
      <div v-for="line of selectedLines" :key="line.ts">
        <q-card class="column">
          <div>
            {{ line.name }} : {{ Math.round(line.dur ?? 0 / 1000) / 1000 }}
            {{
              line.args?.path?.replace(
                new RegExp(`^.*${appState.projectPath ?? '.'}/`),
                '.',
              )
            }}
            : {{ line.args?.pos }}
            <q-btn
              v-if="line.args?.path && line.args?.pos"
              label="goto"
              @click="goto(line.args?.path, line.args?.pos)"
            />
          </div>
          <div>
            <TypesDuring :ts="line.ts" :duration="line.dur ?? 0" />
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>
