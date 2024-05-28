<script setup lang="ts">
const props = defineProps<{ label: string, expanded?: boolean }>()

const emit = defineEmits<{ (e: 'expand'): void }>()

const showBody = ref(props.expanded)

function toggleExpand() {
  showBody.value = !showBody.value
  if (showBody.value)
    emit('expand')
}
</script>

<template>
  <UContainer class="flex flex-col">
    <UContainer class="flex flex-row">
      <div>
        {{ props.label }}
      </div>
      <UIcon :name="`i-heroicons-chevron-${showBody ? 'up' : 'down'}`" dynamic @click="toggleExpand" />
    </UContainer>
    <div v-if="showBody">
      <slot />
    </div>
  </UContainer>
</template>
