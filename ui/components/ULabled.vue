<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string, icon?: string, labelClass?: string, containerClass?: string, iconClick?: () => void }>(), {
  containerClass: 'flex flex-col items-start text-start justify-between',
  labelClass: '',
})
</script>

<template>
  <div :class="containerClass">
    <div :class="props.labelClass">
      {{ label }}
      <div v-if="props.icon" :class="props.labelClass ?? ''" @click="iconClick">
        <UIcon :dynamic="true" :name="`heroicons:${icon}`" size="30" />
      </div>
    </div>
    <div class="pl-0 ">
      <slot />
    </div>
  </div>
</template>
