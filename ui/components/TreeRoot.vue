// TODO:  handle receiving an array of trees to display here
<script setup lang="ts">
import { nodes } from '../src/appState'
</script>

<template>
  <template v-for="tree of nodes" :key="tree.id">
    <TreeNode :tree="tree" :depth="0" :is-in-check="false" />
  </template>
</template>
