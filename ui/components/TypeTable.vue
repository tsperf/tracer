<script setup lang="ts">
import type { TypeLine } from '../../shared/src/traceData'

const props = defineProps<{ types: TypeLine[] }>()
</script>

<template>
  <div>
    <UTable :rows="props.types" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'fetching ...' }" />
  </div>
</template>
