<script setup lang="ts">
const props = withDefaults(defineProps<{ type?: string, label: string, readonly?: boolean }>(), { type: 'text', readonly: false })

const model = defineModel<string | number>()
</script>

<template>
  <vscode-text-field :value="model ?? ''" :type="props.type" :readonly="readonly">
    {{ label }}
  </vscode-text-field>
</template>
