<script setup lang="ts">
const props = defineProps<{ label?: string, icon?: string }>()
</script>

<template>
  <div class="flex flex-row items-center text-center justify-between">
    <div>
      {{ label }}
    </div>
    <div v-if="props.icon">
      <UIcon :dynamic="true" :name="`heroicons:${icon}`" />
    </div>
    <div class="pl-1 ">
      <slot />
    </div>
  </div>
</template>
