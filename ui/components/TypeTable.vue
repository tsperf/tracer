<script setup lang="ts">
import type { TypeLine } from '~/src/traceData'

const props = defineProps<{ types: TypeLine[] }>()
</script>

<template>
  <div>
    <UTable :rows="props.types" />
  </div>
</template>
