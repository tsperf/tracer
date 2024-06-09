<script setup lang="ts">
const props = withDefaults(defineProps<{
  class?: string
  expandable?: boolean
  appendButtonClass?: string
  expandIcon?: [string, string]
  initialExpand?: boolean
}>(), {
  class: '',
  expandable: true,
  initialExpand: false,
})

const emit = defineEmits<{
  (e: 'expand', modifiers: ClickModifier[]): void
  (e: 'unexpand', modifiers: ClickModifier[]): void
}>()
type ClickModifier = 'shift' | 'ctrl' | 'alt' | 'meta'

const expanded = ref(props.initialExpand)

function toggleExpand(evt: MouseEvent) {
  const modifiers: ClickModifier[] = []
  if (evt.altKey)
    modifiers.push('alt')
  if (evt.ctrlKey)
    modifiers.push('ctrl')
  if (evt.metaKey)
    modifiers.push('meta')
  if (evt.shiftKey)
    modifiers.push('shift')

  if (!props.expandable)
    return

  expanded.value = !expanded.value
  if (expanded.value)
    emit('expand', modifiers)
  else
    emit('unexpand', modifiers)
}

function iconName() {
  if (!props.expandable)
    return ''

  if (expanded.value) {
    return props.expandIcon?.[0] || 'i-heroicons-chevron-up'
  }

  return props.expandIcon?.[1] || 'i-heroicons-chevron-right'
}
</script>

<template>
  <div :class="`m-0 p-0 flex flex-col ${props.class}`">
    <div class="m-0 p-0 flex flex-row ">
      <slot name="inset" />
      <button :class="`mb-1 focus:ring-[var(--vscode-focusBorder, blue)] focus:outline-none focus:ring-1 hover:backdrop-invert-[05%] hover:invert-[20%] ${appendButtonClass}`" @click="toggleExpand">
        <UIcon :name="iconName()" dynamic class="mb-1 -pt-1 hover:backdrop-invert-[05%] hover:invert-[20%]" />
      </button>
      <slot name="label" />
    </div>
    <div v-if="expanded">
      <slot />
    </div>
  </div>
</template>
