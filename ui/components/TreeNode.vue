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

const insetClass = props.depth > 0
  ? `-ml-1 min-w-[${props.depth / 2}rem] border-e border-[var(--vscode-tree-inactiveIndentGuidesStroke)] hover:border-[var(--vscode-tree-indentGuidesStroke)]`
  : `-ml-1 min-w-[${props.depth / 2}rem]`

onMounted(() => {
  window.addEventListener('message', handleMessage)
})
</script>

<template>
  <div class="m-0 p-0 flex flex-col gap-0 justify-start w-screen">
    <UExpand class="w-full min-h-1.5 " :expandable="tree.childCnt > 0" @expand="fetchChildren">
      <template #inset>
        <div :class="insetClass" />
      </template>
      <template #label>
        <div class="flex flex-row gap-5 w-full pl-1">
          <TraceLine v-if="'name' in tree.line" :line="tree.line" class="pr-16" />
          <div class="flex flex-row justify-self-end justify-evenly">
            <UExpand v-if="props.tree.typeCnt > 0" class="min-w-40" @expand="fetchTypes">
              <template #label>
                <span class="pl-1">{{ `Types: ${props.tree.typeCnt}` }}</span>
              </template>
              <TypeTable class="relative -left-auto right-auto" :types="types" />
            </UExpand>
            <div v-else class="min-w-40" />
            <button v-if="'args' in tree.line && tree.line.args?.pos !== undefined" class="mr-2 pb-1 mb-1 bg-[var(--vscode-button-background, green)] rounded-sm focus:ring-[var(--vscode-focusBorder, blue)] focus:outline-none focus:ring-1 " @click="gotoPosition">
              <UIcon primary name="i-heroicons-arrow-left-on-rectangle" class="relative top-1  hover:backdrop-invert-[05%] hover:invert-[20%] bg-[var(--vscode-button-foreground, white)] " />
            </button>
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
