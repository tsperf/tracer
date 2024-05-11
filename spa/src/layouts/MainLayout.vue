<script setup lang="ts">
import { ref } from 'vue'
import { appState, processTraceData } from 'src/appState'
import FileOpen from 'components/FileOpen.vue'
import { trpc } from 'src/trpcRouter'

defineOptions({
  name: 'MainLayout',
})

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function ping() {
  trpc.ping.query()
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> TS Trace Viewer </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Project: {{ appState.projectPath }}
        </q-item-label>
        <q-item>
          <FileOpen />
        </q-item>

        <q-item>
          <q-btn label="Process Trace Files" @click="processTraceData" />
        </q-item>
        <q-item>
          <q-btn label="Ping" @click="ping" />
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
