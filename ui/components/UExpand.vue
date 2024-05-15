<script setup lang="ts">
const props = defineProps<{ label: string, expanded?: boolean }>()
const showBody = ref(props.expanded)
</script>

<template>
  <UContainer class="flex flex-col">
    <UContainer class="flex flex-row">
      <div>
        {{ props.label }}
      </div>
      <UIcon :name="`i-heroicons-chevron-${showBody ? 'up' : 'down'}`" dynamic @click="showBody = !showBody" />
    </UContainer>
    <div v-if="showBody">
      <slot />
    </div>
  </UContainer>
</template>
