<script setup lang="ts">
const props = defineProps<{ label?: string, icon?: string, labelDivClass?: string, iconClick?: () => void }>()
</script>

<template>
  <div class="flex flex-col items-start text-start justify-between">
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

<style scoped>
div {
  color: var(--vscode-descriptionForeground);
  background-color: var(--vscode-editor-background);
}
</style>
