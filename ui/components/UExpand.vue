<script setup lang="ts">
const props = withDefaults(defineProps<{ class?: string, expandable?: boolean }>(), {
  class: '',
  expandable: true,
})

const emit = defineEmits<{ (e: 'expand'): void }>()

const expanded = defineModel<boolean>()

function toggleExpand() {
  if (!props.expandable)
    return

  expanded.value = !expanded.value
  if (expanded.value)
    emit('expand')
}

function iconName() {
  return props.expandable
    ? `i-heroicons-chevron-${expanded.value ? 'up' : 'right'}`
    : '' // 'i-heroicons-minus-small' might look better
}
</script>

<template>
  <div :class="`m-0 p-0 flex flex-col ${props.class}`">
    <div class="m-0 p-0 flex flex-row ">
      <slot name="inset" />
      <button class="mb-1 focus:ring-[var(--vscode-focusBorder, blue)] focus:outline-none focus:ring-1 " @click="toggleExpand">
        <UIcon :name="iconName()" dynamic class="mb-1 -pt-1 hover:backdrop-invert-[05%] hover:invert-[20%]" />
      </button>
      <slot name="label" />
    </div>
    <div v-if="expanded">
      <slot />
    </div>
  </div>
</template>
