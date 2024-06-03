// TODO: on expand post message getTreeByID and handle receiving a result of the tree to expand
<script setup lang="ts">
import type { Tree } from '../../src/traceTree'

const props = defineProps<{ tree: Tree, depth: number }>()

const sendMessage = useNuxtApp().$sendMessage
const Messages = useNuxtApp().$Messages

const children = shallowRef([] as Tree['children'])
const types = shallowRef([] as Tree['types'])

function fetchChildren() {
  sendMessage('childrenById', { id: props.tree.id })
}

function fetchTypes() {
  sendMessage('typesById', { id: props.tree.id })
}

function gotoPosition() {
  if ('name' in props.tree.line) {
    const { path, pos } = props.tree.line.args ?? { path: undefined, pos: undefined }
    if (!path || !pos)
      return

    sendMessage('gotoPosition', { fileName: path, pos })
  }
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
  <div class="m-0 flex flex-col justify-start w-screen">
    <UExpand class="w-full min-h-1.5 pb-1" :expandable="tree.childCnt > 0" @expand="fetchChildren">
      <template #inset>
        <div :class="`min-w-[${depth / 2}rem]`" />
      </template>
      <template #label>
        <div class="flex flex-row gap-5 w-full">
          <TraceLine v-if="'name' in tree.line" :line="tree.line" class="pr-16" />
          <div class="flex flex-row justify-self-end justify-evenly">
            <UExpand v-if="props.tree.typeCnt > 0" class="min-w-40" @expand="fetchTypes">
              <template #label>
                {{ `Types: ${props.tree.typeCnt}` }}
              </template>
              <TypeTable class="relative -left-auto right-auto" :types="types" />
            </UExpand>
            <div v-else class="min-w-40" />
            <div v-if="'args' in tree.line && tree.line.args?.pos !== undefined" class="pr-2 pb-1 ">
              <vscode-button class="flex flex-row justify-start w-4 " @click="gotoPosition()">
                <div class="relative float-left relative right-2.5">
                  <UIcon primary name="i-heroicons-arrow-left-on-rectangle" />
                </div>
              </vscode-button>
            </div>
            <div v-else />
            <span class="min-w-40 text-left pl-2 ">{{ `Children: ${props.tree.childCnt}` }} </span>
            <span class="min-w-40 text-left"> {{ `${props.tree.childTypeCnt || props.tree.typeCnt ? `Types: ${props.tree.childTypeCnt + props.tree.typeCnt}` : ''}` }}</span>
          </div>
        </div>
      </template>
      <template v-for="(node, idx) of children" :key="idx">
        <TreeNode v-if="'name' in tree.line" :depth="depth + 1" :tree="node" />
      </template>
    </Uexpand>
  </div>
</template>
