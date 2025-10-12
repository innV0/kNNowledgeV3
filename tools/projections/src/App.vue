<template>
  <div id="app" class="h-screen flex bg-gray-50 text-sm">
    <div class="flex-1 p-3 overflow-y-auto">
      <!-- Controls -->
      <div class="flex gap-2 mb-3 flex-wrap">
        <button @click="viewMode = viewMode === 'monthly' ? 'yearly' : 'monthly'"
                class="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
          {{ viewMode === 'monthly' ? 'Yearly' : 'Monthly' }}
        </button>
        <button @click="addMetric"
                class="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
          Add Metric
        </button>
        <button @click="toggleTableFilter"
                :class="{ 'px-3 py-1.5 rounded text-xs': true, 'bg-gray-600 text-white hover:bg-gray-700': !isFilterExpanded, 'bg-gray-800 text-white': isFilterExpanded }">
          <i class="fas fa-filter mr-1"></i>
          Filters
        </button>
        <button @click="sidebarCollapsed = !sidebarCollapsed"
                class="px-3 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
          <i :class="{ 'fas mr-1': true, 'fa-angle-right': sidebarCollapsed, 'fa-angle-left': !sidebarCollapsed }"></i>
          {{ sidebarCollapsed ? 'Show' : 'Hide' }} Panel
        </button>
        <input type="file" @change="importData" accept=".json,.md"
                class="hidden" ref="fileInput">
        <button @click="$refs.fileInput.click()"
                class="px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">
          Import
        </button>
        <div v-if="metrics.length > 0" class="flex items-center gap-1">
          <select v-model="exportFormat" class="px-2 py-1.5 border border-gray-300 rounded text-xs">
            <option value="json">JSON</option>
            <option value="markdown">MD</option>
          </select>
          <button @click="exportData(exportFormat)"
                  class="px-3 py-1.5 bg-purple-600 text-white rounded text-xs hover:bg-purple-700">
            Export
          </button>
        </div>
      </div>

      <!-- Welcome message -->
      <div v-if="metrics.length === 0" class="bg-white rounded p-4 shadow mb-3">
        <h2 class="text-lg mb-2">Welcome to Financial Projections Tool</h2>
        <p class="text-sm">Import a JSON or Markdown data file to load your business metrics and start analyzing projections.</p>
      </div>

      <!-- Chart -->
      <div v-if="metrics.length > 0" class="sticky top-0 z-10 bg-gray-50 pb-3">
        <ChartView />
      </div>

      <!-- Table -->
      <MetricTable
        v-if="metrics.length > 0"
        :metrics="metrics"
        :projections="projections"
        :periods="periods"
        :view-mode="viewMode"
        :selected-metric-id="selectedMetricId"
        :format-value="formatValue"
        :is-filter-expanded="isFilterExpanded"
        @select-metric="selectMetric"
        @toggle-filter="handleFilterToggle"
      />
    </div>

    <!-- Sidebar -->
    <div v-if="!sidebarCollapsed" class="w-1/3 bg-white p-3 border-l border-gray-200 overflow-y-auto">
      <MetricDetails
        :selected-metric="selectedMetric"
        :metrics="metrics"
        :edit-mode="editMode"
        :current-type="currentType"
        :formula-metric1="formulaMetric1"
        :formula-offset1="formulaOffset1"
        :formula-operation="formulaOperation"
        :formula-metric2="formulaMetric2"
        :formula-offset2="formulaOffset2"
        :offset-options="offsetOptions"
        :chart-metrics="chartMetrics"
        :get-metric-value="getMetricValue"
        :set-metric-value="setMetricValue"
        @toggle-edit="toggleEditMode"
        @toggle-chart="toggleChart"
        @update-type="updateType"
        @update-formula="updateFormula"
        @recalculate="recalculate"
        @move-metric-up="moveMetricUp"
        @move-metric-down="moveMetricDown"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend } from 'chart.js'
import MetricTable from './components/MetricTable.vue'
import MetricDetails from './components/MetricDetails.vue'
import ChartView from './components/ChartView.vue'
import { useMetrics } from './composables/useMetrics'
import { useProjections } from './composables/useProjections'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend)

// Reactive data
const metrics = ref([])

const selectedMetricId = ref(null)
const viewMode = ref('monthly')
const editMode = ref(false)
const formulaMetric1 = ref('')
const formulaOffset1 = ref(0)
const formulaOperation = ref('+')
const formulaMetric2 = ref('')
const formulaOffset2 = ref(0)
const offsetOptions = Array.from({ length: 121 }, (_, i) => i - 60)
const isFilterExpanded = ref(false)
const exportFormat = ref('json')
const sidebarCollapsed = ref(false)

// Composables
const { calculateProjections } = useProjections()
const {
  chartMetrics,
  currentType,
  selectedMetric,
  selectMetric,
  moveMetric,
  deleteMetric,
  toggleEditMode,
  toggleChart,
  updateType,
  updateFormula,
  setMetricValue,
  getMetricValue,
  addMetric,
  recalculate,
  formatValue,
  getDetailedFormula,
  exportData,
  importData
} = useMetrics(metrics, selectedMetricId, editMode, formulaMetric1, formulaOffset1, formulaOperation, formulaMetric2, formulaOffset2)

// Computed
const periods = computed(() => {
  return viewMode.value === 'monthly'
    ? Array.from({ length: 61 }, (_, i) => i)
    : Array.from({ length: 5 }, (_, i) => i + 1)
})

const projections = computed(() => {
  return calculateProjections(metrics.value)
})

// Methods

// Watchers for chart updates

// Chart setup
let chart = null
let hiddenDatasets = new Set() // Track which datasets are hidden via legend clicks

const updateChart = () => {
  const canvas = document.getElementById('chart')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // Get filtered metrics that should be in the chart
  const activeMetrics = projections.value
    .filter((_, idx) => chartMetrics.value.includes(metrics.value[idx].id))

  const datasets = activeMetrics
    .map((row, idx) => ({
      label: row.name,
      data: viewMode.value === 'monthly' ? row.values : row.values.filter((_, i) => i % 12 === 0 && i > 0),
      borderColor: `hsl(${idx * 60}, 70%, 50%)`,
      fill: false,
      hidden: hiddenDatasets.has(row.name) // Restore hidden state
    }))

  if (chart) {
    // Preserve hidden state before destroying
    chart.data.datasets.forEach((dataset, idx) => {
      if (dataset.hidden) {
        hiddenDatasets.add(dataset.label)
      } else {
        hiddenDatasets.delete(dataset.label)
      }
    })
    chart.destroy()
  }

  chart = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: periods.value.map(p => `${viewMode.value === 'monthly' ? 'Month' : 'Year'} ${p}`),
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          onClick: (event, legendItem, legend) => {
            // Track when user clicks legend to hide/show datasets
            const datasetIndex = legendItem.datasetIndex
            const dataset = legend.chart.data.datasets[datasetIndex]
            if (dataset.hidden) {
              hiddenDatasets.delete(dataset.label)
            } else {
              hiddenDatasets.add(dataset.label)
            }
            // Use default Chart.js legend click behavior
            ChartJS.defaults.plugins.legend.onClick(event, legendItem, legend)
          }
        }
      }
    }
  })
}

onMounted(() => {
  updateChart()
})

watch(projections, () => {
  updateChart()
})

watch([chartMetrics, viewMode], () => {
  // Clear hidden datasets that are no longer in chartMetrics
  const activeMetricNames = projections.value
    .filter((_, idx) => chartMetrics.value.includes(metrics.value[idx].id))
    .map(row => row.name)
  hiddenDatasets.forEach(datasetName => {
    if (!activeMetricNames.includes(datasetName)) {
      hiddenDatasets.delete(datasetName)
    }
  })
  updateChart()
}, { deep: true })

const moveMetricUp = (metricId) => {
  const index = metrics.value.findIndex(m => m.id === metricId)
  if (index > 0) {
    const temp = metrics.value[index]
    metrics.value[index] = metrics.value[index - 1]
    metrics.value[index - 1] = temp
  }
}

const moveMetricDown = (metricId) => {
  const index = metrics.value.findIndex(m => m.id === metricId)
  if (index >= 0 && index < metrics.value.length - 1) {
    const temp = metrics.value[index]
    metrics.value[index] = metrics.value[index + 1]
    metrics.value[index + 1] = temp
  }
}

const toggleTableFilter = () => {
  isFilterExpanded.value = !isFilterExpanded.value
}

const handleFilterToggle = (expanded) => {
  isFilterExpanded.value = expanded
}
</script>

<style>
/* Tailwind CSS will be included via Vite */
</style>