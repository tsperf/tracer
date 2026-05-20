<script setup lang="ts">
import { traceConfig } from '~/src/appState'

const sendMessage = useNuxtApp().$sendMessage

const thresholdOptions = [
  { key: 'traceTimeThresholds', label: 'Trace Time' },
  { key: 'traceTypeThresholds', label: 'Trace Types' },
  { key: 'traceTotalTypeThresholds', label: 'Trace Total Types' },
  { key: 'traceTimeRelativeThresholds', label: 'Relative Time' },
  { key: 'traceTypeRelativeThresholds', label: 'Relative Types' },
  { key: 'traceTotalTypeRelativeThresholds', label: 'Relative Total Types' },
] as const

const severityOptions = ['info', 'warning', 'error'] as const

type ThresholdKey = typeof thresholdOptions[number]['key']
type Severity = typeof severityOptions[number]

const selectedThreshold = ref<ThresholdKey>('traceTimeThresholds')

function updateThreshold(event: any, severity: Severity) {
  const value = Number(event.target.value)
  if (Number.isNaN(value))
    return

  const thresholds = { ...traceConfig.value[selectedThreshold.value], [severity]: value }
  traceConfig.value = { ...traceConfig.value, [selectedThreshold.value]: thresholds }
  sendMessage('updateConfig', { key: selectedThreshold.value, value: thresholds })
}

function updateThresholdGroup(event: any) {
  selectedThreshold.value = event.target.value
}

function updateRelativeMode(event: any) {
  const value = event.target.value === 'true'
  traceConfig.value = { ...traceConfig.value, traceDiagnosticsRelative: value }
  sendMessage('updateConfig', { key: 'traceDiagnosticsRelative', value })
}
</script>

<template>
  <div class="trace-settings flex flex-col gap-2">
    <div class="dropdown-container">
      <label for="threshold-group">Trace Diagnostics</label>
      <vscode-dropdown id="threshold-group" :value="selectedThreshold" @change="updateThresholdGroup">
        <template v-for="option of thresholdOptions" :key="option.key">
          <vscode-option :value="option.key" :selected="option.key === selectedThreshold">
            {{ option.label }}
          </vscode-option>
        </template>
      </vscode-dropdown>
    </div>

    <div class="threshold-grid">
      <vscode-text-field
        v-for="severity of severityOptions"
        :key="severity"
        type="number"
        :value="traceConfig[selectedThreshold][severity]"
        @change="updateThreshold($event, severity)"
      >
        {{ severity }}
      </vscode-text-field>
    </div>

    <div class="dropdown-container">
      <label for="relative-mode">Mode</label>
      <vscode-dropdown id="relative-mode" :value="`${traceConfig.traceDiagnosticsRelative}`" @change="updateRelativeMode">
        <vscode-option value="true" :selected="traceConfig.traceDiagnosticsRelative">
          Relative
        </vscode-option>
        <vscode-option value="false" :selected="!traceConfig.traceDiagnosticsRelative">
          Absolute
        </vscode-option>
      </vscode-dropdown>
    </div>
  </div>
</template>

<style scoped>
.trace-settings {
  min-width: 16rem;
}

.threshold-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.35rem;
}
</style>
