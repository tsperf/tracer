<script setup lang="ts">
const props = defineProps<{ label?: string, icon?: string, labelDivClass?: string, iconClick?: () => void }>()
</script>

<template>
  <div class="flex flex-row items-center text-center justify-between">
    <div :class="props.labelDivClass ?? ''">
      {{ label }}
    </div>
    <div class="pl-1 ">
      <slot />
    </div>
    <div v-if="props.icon" :class="props.labelDivClass ?? ''" @click="iconClick">
      <UIcon :dynamic="true" :name="`heroicons:${icon}`" size="30" />
    </div>
  </div>
</template>
