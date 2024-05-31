<script setup lang="ts">
const props = defineProps<{ expanded?: boolean }>()

const emit = defineEmits<{ (e: 'expand'): void }>()

const showBody = ref(props.expanded)

function toggleExpand() {
  showBody.value = !showBody.value
  if (showBody.value)
    emit('expand')
}
</script>

<template>
  <div class="m-0 p-0 f//lex flex-col">
    <div class="m-0 p-0 flex flex-row justify-start align-center text-center">
      <UIcon :name="`i-heroicons-chevron-${showBody ? 'up' : 'right'}`" dynamic @click="toggleExpand" class="mt-1 pt-1" />
      <slot name="label" />
    </div>
    <div v-if="showBody">
      <slot />
    </div>
  </div>
</template>
