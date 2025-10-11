<template>
  <div id="app" class="h-screen flex bg-gray-50">
    <div class="flex-1 p-6 overflow-y-auto">
      <!-- Controls -->
      <div class="flex gap-3 mb-6">
        <button @click="viewMode = viewMode === 'monthly' ? 'yearly' : 'monthly'"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Switch to {{ viewMode === 'monthly' ? 'Yearly' : 'Monthly' }} View
        </button>
        <button @click="addMetric"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Metric
        </button>
        <input type="file" @change="importData" accept=".json"
               class="hidden" ref="fileInput">
        <button @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Import Data
        </button>
        <button @click="exportData" v-if="metrics.length > 0"
                class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Export Data
        </button>
      </div>

      <!-- Welcome message -->
      <div v-if="metrics.length === 0" class="bg-white rounded-lg p-6 shadow mb-6">
        <h2 class="text-2xl mb-4">Welcome to Financial Projections Tool</h2>
        <p>Import a JSON data file to load your business metrics and start analyzing projections.</p>
      </div>

      <!-- Chart -->
      <ChartView v-if="metrics.length > 0" />

      <!-- Table -->
      <MetricTable
        v-if="metrics.length > 0"
        :metrics="metrics"
        :projections="projections"
        :periods="periods"
        :view-mode="viewMode"
        :selected-metric-id="selectedMetricId"
        :format-value="formatValue"
        @select-metric="selectMetric"
      />
    </div>

    <!-- Sidebar -->
    <div class="w-1/3 bg-white p-4 border-l border-gray-200 overflow-y-auto">
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
</script>

<style>
/* Tailwind CSS will be included via Vite */
</style>