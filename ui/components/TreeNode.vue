// TODO: on expand post message getTreeByID and handle receiving a result of the tree to expand
<script setup lang="ts">
import type { Tree } from '../../src/traceTree'

const props = defineProps<{ tree: Tree, depth: number }>()

const sendMesage = useNuxtApp().$sendMessage
const Messages = useNuxtApp().$Messages

const children = shallowRef([] as Tree['children'])
const types = shallowRef([] as Tree['types'])

function fetchChildren() {
  sendMesage('childrenById', { id: props.tree.id })
}

function fetchTypes() {
  sendMesage('typesById', { id: props.tree.id })
}

function handleMessage(e: MessageEvent<unknown>) {
  const parsed = Messages.message.safeParse(e.data)
  if (!parsed.success)
    return

  switch (parsed.data.message) {
    case 'childrenById':
      if (parsed.data.id === props.tree.id)
        children.value = parsed.data.children ?? []
      break
    case 'typesById':
      if (parsed.data.id === props.tree.id)
        types.value = parsed.data.types ?? []
      break
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div class="m-0 pl-3 flex flex-col justify-start">
    <UExpand @expand="fetchChildren">
      <template #label>
        <div class="flex flex-row gap-5 flex-nowrap">
          <TraceLine v-if="'name' in tree.line" :line="tree.line" class="pr-16" />
          <span>{{ `Children: ${props.tree.childCnt} ${props.tree.childTypeCnt || props.tree.typeCnt ? `Types: ${props.tree.childTypeCnt + props.tree.typeCnt}` : ''}` }}</span>
        </div>
      </template>
      <template v-for="(node, idx) of children" :key="idx">
        <TreeNode v-if="'name' in tree.line" :depth="depth + 1" :tree="node" />
      </template>
    </Uexpand>
    <UExpand v-if="props.tree.typeCnt > 0" class="pl-1" @expand="fetchTypes">
      <template #label>
        {{ `Types: ${props.tree.typeCnt}` }}
      </template>
      <TypeTable :types="types" />
    </UExpand>
  </div>
</template>
