<template>
  <div id="app" class="h-screen flex flex-col bg-gray-50 text-sm">
    <!-- Header with Export Button -->
    <div class="w-full bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center flex-shrink-0">
      <div class="flex">
        <button @click="activeTab = 'document'"
                :class="{ 'px-4 py-2 text-sm font-medium border-b-2': true, 'border-blue-500 text-blue-600': activeTab === 'document', 'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'document' }">
          📄 Document
        </button>
        <button @click="activeTab = 'projections'"
                :class="{ 'px-4 py-2 text-sm font-medium border-b-2': true, 'border-blue-500 text-blue-600': activeTab === 'projections', 'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'projections' }">
          📊 Projections
        </button>
        <button @click="activeTab = 'artifacts'"
                :class="{ 'px-4 py-2 text-sm font-medium border-b-2': true, 'border-blue-500 text-blue-600': activeTab === 'artifacts', 'border-transparent text-gray-500 hover:text-gray-700': activeTab !== 'artifacts' }">
          🎨 Artifacts
        </button>
      </div>
      <div v-if="hasAnyData" class="flex items-center gap-2">
        <button @click="exportUnifiedDocument"
                class="px-3 py-1.5 bg-purple-600 text-white rounded text-xs hover:bg-purple-700">
          Export Unified Document
        </button>
      </div>
    </div>

    <!-- Tab Content Container -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Main Content Area -->
      <div class="flex-1 p-3 overflow-y-auto" :class="{ 'pr-1/3': activeTab === 'projections' && !sidebarCollapsed }">
        <!-- Document Tab -->
        <div v-if="activeTab === 'document'" class="space-y-4">
          <!-- Controls -->
          <div class="flex gap-2 mb-3 flex-wrap">
            <input type="file" @change="importData" accept=".json,.md"
                    class="hidden" ref="fileInput">
            <button @click="$refs.fileInput.click()"
                    class="px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">
              Import Logseq File
            </button>
          </div>

          <!-- Welcome message -->
          <div v-if="!documentContent" class="bg-white rounded p-4 shadow mb-3">
            <h2 class="text-lg mb-2">Business Model Document</h2>
            <p class="text-sm">Import a Logseq Markdown file to view your business model document. The document should contain H1 sections for different parts of your business plan.</p>
          </div>

          <!-- Document Content -->
          <div v-if="documentContent" class="bg-white rounded p-4 shadow">
            <div v-html="renderMarkdown(documentContent)" class="prose prose-sm max-w-none"></div>
          </div>
        </div>

        <!-- Projections Tab -->
        <div v-if="activeTab === 'projections'" class="space-y-4">
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
          </div>

          <!-- Welcome message -->
          <div v-if="metrics.length === 0" class="bg-white rounded p-4 shadow mb-3">
            <h2 class="text-lg mb-2">Financial Projections</h2>
            <p class="text-sm">Import a Logseq file with projections data or switch to the Document tab to import a complete business model file.</p>
          </div>

          <!-- Chart -->
          <div v-if="metrics.length > 0" class="relative z-0 bg-gray-50 pb-3">
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

        <!-- Artifacts Tab -->
        <div v-if="activeTab === 'artifacts'" class="space-y-4">

          <!-- Welcome message -->
          <div v-if="!artifactsData" class="bg-white rounded p-4 shadow mb-3">
            <h2 class="text-lg mb-2">Business Artifacts</h2>
            <p class="text-sm">Import a Logseq file with an "# Artifacts" section to view your business modeling artifacts here.</p>
          </div>

          <!-- Artifacts Content -->
          <div v-if="artifactsData" class="space-y-4">
            <div v-if="artifactsData.businessModelCanvas" class="bg-white rounded p-4 shadow">
              <h3 class="text-lg font-bold mb-4">🎨 Business Model Canvas</h3>
              <div class="grid grid-cols-5 gap-4 text-sm">
                <div class="col-span-1 bg-gray-50 p-2 rounded border">
                  <h4 class="font-bold mb-2">Key Partners</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.businessModelCanvas.keyPartners" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="col-span-1 grid grid-rows-2 gap-4">
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Key Activities</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.businessModelCanvas.keyActivities" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Key Resources</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.businessModelCanvas.keyResources" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
                <div class="col-span-1 bg-gray-50 p-2 rounded border">
                  <h4 class="font-bold mb-2">Value Propositions</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.businessModelCanvas.valueProposition" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="col-span-1 grid grid-rows-2 gap-4">
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Customer Relationships</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.businessModelCanvas.customerRelationships" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Channels</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.businessModelCanvas.channels" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
                <div class="col-span-1 bg-gray-50 p-2 rounded border">
                  <h4 class="font-bold mb-2">Customer Segments</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.businessModelCanvas.customerSegments" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="col-span-5 grid grid-cols-2 gap-4 mt-4">
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Cost Structure</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.businessModelCanvas.costStructure" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Revenue Streams</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.businessModelCanvas.revenueStreams" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="artifactsData.leanCanvas" class="bg-white rounded p-4 shadow">
              <h3 class="text-lg font-bold mb-4">🚀 Lean Canvas</h3>
              <div class="grid grid-cols-5 gap-4 text-sm">
                <div class="col-span-1 bg-gray-50 p-2 rounded border">
                  <h4 class="font-bold mb-2">Problem</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.leanCanvas.problem" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="col-span-1 grid grid-rows-2 gap-4">
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Solution</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.leanCanvas.solution" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Key Metrics</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.leanCanvas.keyMetrics" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
                <div class="col-span-1 bg-gray-50 p-2 rounded border">
                  <h4 class="font-bold mb-2">Unique Value Proposition</h4>
                  <p class="text-xs">{{ artifactsData.leanCanvas.uniqueValueProposition }}</p>
                </div>
                <div class="col-span-1 grid grid-rows-2 gap-4">
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Unfair Advantage</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.leanCanvas.unfairAdvantage" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Channels</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.leanCanvas.channels" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
                <div class="col-span-1 bg-gray-50 p-2 rounded border">
                  <h4 class="font-bold mb-2">Customer Segments</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.leanCanvas.customerSegments" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="col-span-5 grid grid-cols-2 gap-4 mt-4">
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Cost Structure</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.leanCanvas.costStructure" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 p-2 rounded border">
                    <h4 class="font-bold mb-2">Revenue Streams</h4>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.leanCanvas.revenueStreams" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="artifactsData.swotAnalysis" class="bg-white rounded p-4 shadow">
              <h3 class="text-lg font-bold mb-4">📊 SWOT Analysis</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-green-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-green-800">Strengths</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.swotAnalysis.strengths" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="bg-red-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-red-800">Weaknesses</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.swotAnalysis.weaknesses" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="bg-blue-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-blue-800">Opportunities</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.swotAnalysis.opportunities" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="bg-orange-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-orange-800">Threats</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.swotAnalysis.threats" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="artifactsData.valuePropositionCanvas" class="bg-white rounded p-4 shadow">
              <h3 class="text-lg font-bold mb-4">💡 Value Proposition Canvas</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="space-y-4">
                  <h4 class="font-bold">Value Map</h4>
                  <div class="bg-purple-50 p-2 rounded border">
                    <h5 class="font-semibold mb-2 text-purple-800">Products & Services</h5>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.valuePropositionCanvas.valueMap.productsAndServices" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-red-50 p-2 rounded border">
                    <h5 class="font-semibold mb-2 text-red-800">Pain Relievers</h5>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.valuePropositionCanvas.valueMap.painRelievers" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-green-50 p-2 rounded border">
                    <h5 class="font-semibold mb-2 text-green-800">Gain Creators</h5>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.valuePropositionCanvas.valueMap.gainCreators" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
                <div class="space-y-4">
                  <h4 class="font-bold">Customer Profile</h4>
                  <div class="bg-blue-50 p-2 rounded border">
                    <h5 class="font-semibold mb-2 text-blue-800">Customer Jobs</h5>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.valuePropositionCanvas.customerProfile.customerJobs" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-orange-50 p-2 rounded border">
                    <h5 class="font-semibold mb-2 text-orange-800">Customer Pains</h5>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.valuePropositionCanvas.customerProfile.customerPains" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <div class="bg-green-50 p-2 rounded border">
                    <h5 class="font-semibold mb-2 text-green-800">Customer Gains</h5>
                    <ul class="list-disc list-inside text-xs">
                      <li v-for="item in artifactsData.valuePropositionCanvas.customerProfile.customerGains" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="artifactsData.empathyMap" class="bg-white rounded p-4 shadow">
              <h3 class="text-lg font-bold mb-4">🧠 Empathy Map</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-blue-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-blue-800">Says</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.empathyMap.says" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="bg-purple-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-purple-800">Thinks</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.empathyMap.thinks" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="bg-green-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-green-800">Does</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.empathyMap.does" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="bg-orange-50 p-2 rounded border">
                  <h4 class="font-bold mb-2 text-orange-800">Feels</h4>
                  <ul class="list-disc list-inside text-xs">
                    <li v-for="item in artifactsData.empathyMap.feels" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="artifactsData.competitiveAnalysis" class="bg-white rounded p-4 shadow">
              <h3 class="text-lg font-bold mb-4">🆚 Competitive Analysis</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full table-auto text-sm">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left font-bold">Feature</th>
                      <th v-for="header in artifactsData.competitiveAnalysis.headers.slice(1)" :key="header" class="px-4 py-2 text-left font-bold">{{ header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in artifactsData.competitiveAnalysis.rows" :key="row.feature || row[0]" class="border-t">
                      <td class="px-4 py-2">{{ row.feature || row[0] }}</td>
                      <td v-for="value in (row.values || row.slice(1))" :key="value" class="px-4 py-2">{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Sidebar for Projections Tab -->
      <div v-if="activeTab === 'projections' && metrics.length > 0"
           class="fixed right-0 top-0 h-full bg-white border-l border-gray-200 overflow-hidden z-10 transition-all duration-300"
           :style="{ width: sidebarCollapsed ? '40px' : '33.333%' }">
        <div v-if="!sidebarCollapsed" class="w-full h-full flex flex-col">
          <div class="flex justify-between items-center p-3 border-b border-gray-200 flex-shrink-0">
            <h2 class="text-lg font-semibold">Metric Details</h2>
            <button @click="sidebarCollapsed = true"
                    class="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 text-xs">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-3">
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
              :configuration="configuration"
              :get-metric-value="getMetricValue"
              :set-metric-value="setMetricValue"
              @toggle-edit="editMode = !editMode"
              @toggle-chart="toggleChart"
              @update-type="updateType"
              @update-formula="updateFormula"
              @recalculate="recalculate"
              @set-metric-value="setMetricValue"
              @move-metric-up="moveMetricUp"
              @move-metric-down="moveMetricDown"
            />
          </div>
        </div>
        <div v-else class="w-full h-full flex items-center justify-center">
          <button @click="sidebarCollapsed = false"
                  class="p-2 bg-white border border-gray-200 rounded-l shadow hover:bg-gray-50 transform rotate-180">
            <i class="fas fa-chevron-left"></i>
          </button>
        </div>
      </div>
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
import { LogseqParser, ProjectionsParser, LegacyProjectionsParser } from './utils/logseqParser.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend)

// Reactive data
const metrics = ref([])
const activeTab = ref('document')
const documentContent = ref('')
const artifactsData = ref(null)

// Computed
const hasAnyData = computed(() => {
  return documentContent.value || metrics.value.length > 0 || artifactsData.value
})

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
const configuration = ref({
  timeHorizon: 61,
  timeUnit: 'months',
  systemMetrics: {}
})

// Composables
const { calculateProjections } = useProjections(configuration.value)
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
  importData: originalImportData
} = useMetrics(metrics, selectedMetricId, editMode, formulaMetric1, formulaOffset1, formulaOperation, formulaMetric2, formulaOffset2, configuration.value)

// Computed
const periods = computed(() => {
  const horizon = configuration.value.timeHorizon || 61
  return viewMode.value === 'monthly'
    ? Array.from({ length: horizon }, (_, i) => i)
    : Array.from({ length: Math.ceil(horizon / 12) }, (_, i) => i + 1)
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

  // Get container dimensions to ensure chart fits properly
  const container = canvas.parentElement
  const containerWidth = container ? container.clientWidth : 800
  const containerHeight = container ? container.clientHeight : 180

  // Set canvas dimensions to match container
  canvas.width = containerWidth
  canvas.height = containerHeight

  chart = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: periods.value.map(p => `${viewMode.value === 'monthly' ? 'Month' : 'Year'} ${p + 1}`),
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
  // Force chart update when sidebar state changes to ensure proper sizing
  setTimeout(() => updateChart(), 100)
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

// Unified document functions
const parseLogseqDocument = (content) => {
  const parser = new LogseqParser()
  return parser.parseDocument(content)
}

const renderMarkdown = (markdown) => {
  // Simple markdown renderer for basic formatting
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br>')

  // Wrap in paragraph tags if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p class="mb-2">' + html + '</p>'
  }

  return html
}

const exportUnifiedDocument = () => {
  let content = documentContent.value || ''

  if (metrics.value.length > 0) {
    content += '\n\n- # Data\n\n'

    // Add configuration
    content += 'timeHorizon:: 61\n'
    content += 'timeUnit:: months\n'
    content += 'systemMetrics::\n'
    Object.entries(configuration.value.systemMetrics).forEach(([key, value]) => {
      content += `  ${key}:: ${value}\n`
    })
    content += '\n'

    // Add metadata (Logseq properties without asterisks)
    const allTags = [...new Set(metrics.value.flatMap(m => m.tags || []))]
    if (allTags.length > 0) {
      content += `tags:: [[${allTags.join(']], [[')}]]\n`
    }
    content += `selectedMetricId:: ${selectedMetricId.value || ''}\n`
    content += `viewMode:: ${viewMode.value}\n`
    content += `chartMetrics:: ${JSON.stringify(chartMetrics.value)}\n\n`

    content += '## Business Metrics (Metrics Array)\n\n'

    metrics.value.forEach((metric, index) => {
      // Metric header with bullet point
      content += `- [[${metric.name}]]\n`

      // Core properties (Logseq properties without asterisks)
      content += `  id:: ${metric.id}\n`
      content += `  slug:: ${metric.slug}\n`
      content += `  description:: ${metric.description}\n`
      content += `  type:: ${metric.type}\n`
      if (metric.unit) content += `  unit:: ${metric.unit}\n`
      content += `  color:: ${metric.color}\n`
      content += `  interpolation:: ${metric.interpolation}\n`
      if (metric.tags && metric.tags.length > 0) {
        content += `  tags:: [[${metric.tags.join(']], [[')}]]\n`
      }

      // Formula for calculated metrics
      if (metric.type === 'calculated' && metric.formula) {
        content += `  formula:: ${metric.formula}\n`
      }

      // Values subsection for variable metrics
      if (metric.type === 'variable' && metric.values && Object.keys(metric.values).length > 0) {
        content += `  values::\n`
        content += `  collapsed:: true\n`
        // Sort keys for consistent output
        Object.keys(metric.values).sort().forEach(key => {
          content += `    - ${key}:: ${metric.values[key]}\n`
        })
        content += `    format::\n`
        if (metric.format) {
          Object.entries(metric.format).forEach(([key, value]) => {
            content += `    ${key}:: ${value}\n`
          })
        }
      } else if (metric.format) {
        // For calculated metrics or metrics without values, put format inline
        content += `  format::\n`
        Object.entries(metric.format).forEach(([key, value]) => {
          content += `    ${key}:: ${value}\n`
        })
      }

      content += '\n'
    })
  }

  // Add artifacts section if exists
  if (artifactsData.value) {
    content += '\n\n- # Artifacts\n\n'
    content += exportArtifactsToLogseqContent()
  }

  // Download file
  const filename = `unified-business-model-${new Date().toISOString().split('T')[0]}.md`
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const exportArtifactsToLogseq = () => {
  if (!artifactsData.value) return

  const content = exportArtifactsToLogseqContent()
  const filename = `artifacts-${new Date().toISOString().split('T')[0]}.md`
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const exportArtifactsToLogseqContent = () => {
  if (!artifactsData.value) return '- # Artifacts\n\n* No artifacts data available\n'

  let content = ''
  content += `artifact_count:: ${Object.keys(artifactsData.value).length}\n`
  content += `export_format:: logseq\n`
  content += `created_date:: ${new Date().toISOString()}\n`
  content += `tags:: [[business-modeling]], [[artifacts]]\n\n`

  // Business Model Canvas
  if (artifactsData.value.businessModelCanvas) {
    content += '- ## Business Model Canvas\n\n'
    content += 'artifact_type:: business-model-canvas\n'
    content += `last_modified:: ${new Date().toISOString()}\n\n`

    const canvas = artifactsData.value.businessModelCanvas
    content += '### Key Partners\n'
    content += formatListForLogseq(canvas.keyPartners || [])
    content += '\n\n'

    content += '### Key Activities\n'
    content += formatListForLogseq(canvas.keyActivities || [])
    content += '\n\n'

    content += '### Key Resources\n'
    content += formatListForLogseq(canvas.keyResources || [])
    content += '\n\n'

    content += '### Value Propositions\n'
    content += formatListForLogseq(canvas.valueProposition || [])
    content += '\n\n'

    content += '### Customer Relationships\n'
    content += formatListForLogseq(canvas.customerRelationships || [])
    content += '\n\n'

    content += '### Channels\n'
    content += formatListForLogseq(canvas.channels || [])
    content += '\n\n'

    content += '### Customer Segments\n'
    content += formatListForLogseq(canvas.customerSegments || [])
    content += '\n\n'

    content += '### Cost Structure\n'
    content += formatListForLogseq(canvas.costStructure || [])
    content += '\n\n'

    content += '### Revenue Streams\n'
    content += formatListForLogseq(canvas.revenueStreams || [])
    content += '\n\n'
  }

  // Lean Canvas
  if (artifactsData.value.leanCanvas) {
    content += '- ## Lean Canvas\n\n'
    content += 'artifact_type:: lean-canvas\n'
    content += `last_modified:: ${new Date().toISOString()}\n\n`

    const lean = artifactsData.value.leanCanvas
    content += '### Problem\n'
    content += formatListForLogseq(lean.problem || [])
    content += '\n\n'

    content += '### Solution\n'
    content += formatListForLogseq(lean.solution || [])
    content += '\n\n'

    content += '### Key Metrics\n'
    content += formatListForLogseq(lean.keyMetrics || [])
    content += '\n\n'

    content += '### Unique Value Proposition\n'
    content += `${lean.uniqueValueProposition || 'Not specified'}\n\n`

    content += '### Unfair Advantage\n'
    content += formatListForLogseq(lean.unfairAdvantage || [])
    content += '\n\n'

    content += '### Channels\n'
    content += formatListForLogseq(lean.channels || [])
    content += '\n\n'

    content += '### Customer Segments\n'
    content += formatListForLogseq(lean.customerSegments || [])
    content += '\n\n'

    content += '### Cost Structure\n'
    content += formatListForLogseq(lean.costStructure || [])
    content += '\n\n'

    content += '### Revenue Streams\n'
    content += formatListForLogseq(lean.revenueStreams || [])
    content += '\n\n'
  }

  // SWOT Analysis
  if (artifactsData.value.swotAnalysis) {
    content += '- ## SWOT Analysis\n\n'
    content += 'artifact_type:: swot-analysis\n'
    content += `last_modified:: ${new Date().toISOString()}\n\n`

    const swot = artifactsData.value.swotAnalysis
    content += '### Strengths\n'
    content += formatListForLogseq(swot.strengths || [])
    content += '\n\n'

    content += '### Weaknesses\n'
    content += formatListForLogseq(swot.weaknesses || [])
    content += '\n\n'

    content += '### Opportunities\n'
    content += formatListForLogseq(swot.opportunities || [])
    content += '\n\n'

    content += '### Threats\n'
    content += formatListForLogseq(swot.threats || [])
    content += '\n\n'
  }

  // Value Proposition Canvas
  if (artifactsData.value.valuePropositionCanvas) {
    content += '- ## Value Proposition Canvas\n\n'
    content += 'artifact_type:: value-proposition-canvas\n'
    content += `last_modified:: ${new Date().toISOString()}\n\n`

    const vpc = artifactsData.value.valuePropositionCanvas
    content += '### Value Map\n'
    content += '#### Products & Services\n'
    content += formatListForLogseq(vpc.valueMap?.productsAndServices || [])
    content += '\n\n'

    content += '#### Pain Relievers\n'
    content += formatListForLogseq(vpc.valueMap?.painRelievers || [])
    content += '\n\n'

    content += '#### Gain Creators\n'
    content += formatListForLogseq(vpc.valueMap?.gainCreators || [])
    content += '\n\n'

    content += '### Customer Profile\n'
    content += '#### Customer Jobs\n'
    content += formatListForLogseq(vpc.customerProfile?.customerJobs || [])
    content += '\n\n'

    content += '#### Customer Pains\n'
    content += formatListForLogseq(vpc.customerProfile?.customerPains || [])
    content += '\n\n'

    content += '#### Customer Gains\n'
    content += formatListForLogseq(vpc.customerProfile?.customerGains || [])
    content += '\n\n'
  }

  // Competitive Analysis
  if (artifactsData.value.competitiveAnalysis) {
    content += '- ## Competitive Analysis\n\n'
    content += 'artifact_type:: competitive-analysis\n'
    content += `last_modified:: ${new Date().toISOString()}\n\n`

    const comp = artifactsData.value.competitiveAnalysis
    if (comp.headers && comp.rows) {
      content += '| Feature |'
      comp.headers.slice(1).forEach(header => {
        content += ` ${header} |`
      })
      content += '\n| --- |'
      comp.headers.slice(1).forEach(() => {
        content += ' --- |'
      })
      content += '\n'

      comp.rows.forEach(row => {
        content += `| ${row.feature || row[0]} |`
        ;(row.values || row.slice(1)).forEach(value => {
          content += ` ${value} |`
        })
        content += '\n'
      })
      content += '\n'
    }
  }

  return content
}

const formatListForLogseq = (items) => {
  if (!Array.isArray(items)) return ''
  return items.map(item => `- ${item}`).join('\n')
}

// Override importData to handle unified documents
const importData = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('Starting import of file:', file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target.result
        console.log('File content loaded, length:', content.length)

        if (file.name.endsWith('.md')) {
          console.log('Processing as Markdown file')
          // Handle Logseq unified document
          const sections = parseLogseqDocument(content)
          console.log('Parsed sections:', {
            document: sections.document ? sections.document.length : 0,
            projections: sections.projections ? sections.projections.length : 0,
            artifacts: sections.artifacts ? sections.artifacts.length : 0
          })

          documentContent.value = sections.document

          const parsedArtifacts = parseArtifactsSection(sections.artifacts)
          artifactsData.value = parsedArtifacts

          // Parse projections section
          if (sections.projections && sections.projections.trim()) {
            console.log('About to parse projections section, length:', sections.projections.length)
            console.log('Projections content preview:', sections.projections.substring(0, 200))
            const result = parseProjectionsSection(sections.projections)
            console.log('After parsing, metrics count:', metrics.value.length)

            // Update configuration from parsed data
            if (result.configuration) {
              configuration.value = result.configuration
              console.log('Updated configuration:', configuration.value)
            }
          } else {
            console.log('No projections section found or empty')
          }
        } else {
          console.log('Processing as JSON file')
          // Fallback to original JSON import
          originalImportData(event)
        }
      } catch (error) {
        console.error('Import error:', error)
        alert('Error importing file: ' + error.message)
      }
    }
    reader.readAsText(file)
  }
}

const parseArtifactsSection = (artifactsContent) => {
  console.log('Parsing artifacts section, content length:', artifactsContent.length)
  console.log('Artifacts content preview:', artifactsContent.substring(0, 500))

  // Parse Logseq artifacts section into structured data
  const lines = artifactsContent.split('\n')
  const artifacts = {}

  let currentArtifact = null
  let currentSection = null

  console.log('Total lines in artifacts:', lines.length)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    console.log(`Line ${i}: "${trimmed}" (artifact: ${currentArtifact}, section: ${currentSection})`)

    // Detect artifact sections (handle both bullet and header formats)
    if (trimmed === '## Business Model Canvas' || trimmed === '- ## Business Model Canvas') {
      currentArtifact = 'businessModelCanvas'
      artifacts.businessModelCanvas = {}
      console.log('Started Business Model Canvas')
    } else if (trimmed === '## Lean Canvas' || trimmed === '- ## Lean Canvas') {
      currentArtifact = 'leanCanvas'
      artifacts.leanCanvas = {}
      console.log('Started Lean Canvas')
    } else if (trimmed === '## SWOT Analysis' || trimmed === '- ## SWOT Analysis') {
      currentArtifact = 'swotAnalysis'
      artifacts.swotAnalysis = {}
      console.log('Started SWOT Analysis')
    } else if (trimmed === '## Value Proposition Canvas' || trimmed === '- ## Value Proposition Canvas') {
      currentArtifact = 'valuePropositionCanvas'
      artifacts.valuePropositionCanvas = { valueMap: {}, customerProfile: {} }
      console.log('Started Value Proposition Canvas')
    } else if (trimmed === '## Empathy Map' || trimmed === '- ## Empathy Map') {
      currentArtifact = 'empathyMap'
      artifacts.empathyMap = {}
      console.log('Started Empathy Map')
    } else if (trimmed === '## Competitive Analysis' || trimmed === '- ## Competitive Analysis') {
      currentArtifact = 'competitiveAnalysis'
      artifacts.competitiveAnalysis = { headers: [], rows: [] }
      console.log('Started Competitive Analysis')
    }

    // Parse sub-sections (handle both bullet and header formats, including deeper levels)
    else if (currentArtifact && (trimmed.startsWith('### ') || trimmed.startsWith('- ### ') || trimmed.startsWith('#### ') || trimmed.startsWith('- #### '))) {
      const section = trimmed.replace(/^(- )?(###|####) /, '').toLowerCase().replace(/[^a-z]/g, '')
      currentSection = section
      console.log(`Started section: ${section}`)

      if (currentArtifact === 'businessModelCanvas') {
        if (section.includes('keypartners')) artifacts.businessModelCanvas.keyPartners = []
        else if (section.includes('keyactivities')) artifacts.businessModelCanvas.keyActivities = []
        else if (section.includes('keyresources')) artifacts.businessModelCanvas.keyResources = []
        else if (section.includes('valuepropositions')) artifacts.businessModelCanvas.valueProposition = []
        else if (section.includes('customerrelationships')) artifacts.businessModelCanvas.customerRelationships = []
        else if (section.includes('channels')) artifacts.businessModelCanvas.channels = []
        else if (section.includes('customersegments')) artifacts.businessModelCanvas.customerSegments = []
        else if (section.includes('coststructure')) artifacts.businessModelCanvas.costStructure = []
        else if (section.includes('revenuestreams')) artifacts.businessModelCanvas.revenueStreams = []
      } else if (currentArtifact === 'leanCanvas') {
        if (section.includes('problem')) artifacts.leanCanvas.problem = []
        else if (section.includes('solution')) artifacts.leanCanvas.solution = []
        else if (section.includes('keymetrics')) artifacts.leanCanvas.keyMetrics = []
        else if (section.includes('uniquevalueproposition')) {
          currentSection = 'uniquevalueproposition'
          console.log('Set currentSection to uniquevalueproposition')
        }
        else if (section.includes('unfairadvantage')) artifacts.leanCanvas.unfairAdvantage = []
        else if (section.includes('channels')) artifacts.leanCanvas.channels = []
        else if (section.includes('customersegments')) artifacts.leanCanvas.customerSegments = []
        else if (section.includes('coststructure')) artifacts.leanCanvas.costStructure = []
        else if (section.includes('revenuestreams')) artifacts.leanCanvas.revenueStreams = []
      } else if (currentArtifact === 'swotAnalysis') {
        if (section.includes('strengths')) artifacts.swotAnalysis.strengths = []
        else if (section.includes('weaknesses')) artifacts.swotAnalysis.weaknesses = []
        else if (section.includes('opportunities')) artifacts.swotAnalysis.opportunities = []
        else if (section.includes('threats')) artifacts.swotAnalysis.threats = []
      } else if (currentArtifact === 'empathyMap') {
        if (section.includes('says')) artifacts.empathyMap.says = []
        else if (section.includes('thinks')) artifacts.empathyMap.thinks = []
        else if (section.includes('does')) artifacts.empathyMap.does = []
        else if (section.includes('feels')) artifacts.empathyMap.feels = []
      } else if (currentArtifact === 'valuePropositionCanvas') {
        if (section.includes('products')) {
          artifacts.valuePropositionCanvas.valueMap.productsAndServices = []
          currentSection = 'productsandservices'
        }
        else if (section.includes('painrelievers')) {
          artifacts.valuePropositionCanvas.valueMap.painRelievers = []
          currentSection = 'painrelievers'
        }
        else if (section.includes('gaincreators')) {
          artifacts.valuePropositionCanvas.valueMap.gainCreators = []
          currentSection = 'gaincreators'
        }
        else if (section.includes('customerjobs')) {
          artifacts.valuePropositionCanvas.customerProfile.customerJobs = []
          currentSection = 'customerjobs'
        }
        else if (section.includes('customerpains')) {
          artifacts.valuePropositionCanvas.customerProfile.customerPains = []
          currentSection = 'customerpains'
        }
        else if (section.includes('customergains')) {
          artifacts.valuePropositionCanvas.customerProfile.customerGains = []
          currentSection = 'customergains'
        }
      }
    }

    // Parse list items
    else if (currentArtifact && trimmed.startsWith('- ')) {
      const item = trimmed.substring(2)
      console.log(`Adding item to ${currentArtifact}.${currentSection}: "${item}"`)

      if (currentArtifact === 'businessModelCanvas') {
        if (currentSection === 'keypartners' && artifacts.businessModelCanvas.keyPartners) {
          artifacts.businessModelCanvas.keyPartners.push(item)
        } else if (currentSection === 'keyactivities' && artifacts.businessModelCanvas.keyActivities) {
          artifacts.businessModelCanvas.keyActivities.push(item)
        } else if (currentSection === 'keyresources' && artifacts.businessModelCanvas.keyResources) {
          artifacts.businessModelCanvas.keyResources.push(item)
        } else if (currentSection === 'valuepropositions' && artifacts.businessModelCanvas.valueProposition) {
          artifacts.businessModelCanvas.valueProposition.push(item)
        } else if (currentSection === 'customerrelationships' && artifacts.businessModelCanvas.customerRelationships) {
          artifacts.businessModelCanvas.customerRelationships.push(item)
        } else if (currentSection === 'channels' && artifacts.businessModelCanvas.channels) {
          artifacts.businessModelCanvas.channels.push(item)
        } else if (currentSection === 'customersegments' && artifacts.businessModelCanvas.customerSegments) {
          artifacts.businessModelCanvas.customerSegments.push(item)
        } else if (currentSection === 'coststructure' && artifacts.businessModelCanvas.costStructure) {
          artifacts.businessModelCanvas.costStructure.push(item)
        } else if (currentSection === 'revenuestreams' && artifacts.businessModelCanvas.revenueStreams) {
          artifacts.businessModelCanvas.revenueStreams.push(item)
        }
      } else if (currentArtifact === 'leanCanvas') {
        if (currentSection === 'problem' && artifacts.leanCanvas.problem) {
          artifacts.leanCanvas.problem.push(item)
        } else if (currentSection === 'solution' && artifacts.leanCanvas.solution) {
          artifacts.leanCanvas.solution.push(item)
        } else if (currentSection === 'keymetrics' && artifacts.leanCanvas.keyMetrics) {
          artifacts.leanCanvas.keyMetrics.push(item)
        } else if (currentSection === 'unfairadvantage' && artifacts.leanCanvas.unfairAdvantage) {
          artifacts.leanCanvas.unfairAdvantage.push(item)
        } else if (currentSection === 'channels' && artifacts.leanCanvas.channels) {
          artifacts.leanCanvas.channels.push(item)
        } else if (currentSection === 'customersegments' && artifacts.leanCanvas.customerSegments) {
          artifacts.leanCanvas.customerSegments.push(item)
        } else if (currentSection === 'coststructure' && artifacts.leanCanvas.costStructure) {
          artifacts.leanCanvas.costStructure.push(item)
        } else if (currentSection === 'revenuestreams' && artifacts.leanCanvas.revenueStreams) {
          artifacts.leanCanvas.revenueStreams.push(item)
        } else if (currentSection === 'uniquevalueproposition') {
          artifacts.leanCanvas.uniqueValueProposition = item
        }
      } else if (currentArtifact === 'swotAnalysis') {
        if (currentSection === 'strengths' && artifacts.swotAnalysis.strengths) {
          artifacts.swotAnalysis.strengths.push(item)
        } else if (currentSection === 'weaknesses' && artifacts.swotAnalysis.weaknesses) {
          artifacts.swotAnalysis.weaknesses.push(item)
        } else if (currentSection === 'opportunities' && artifacts.swotAnalysis.opportunities) {
          artifacts.swotAnalysis.opportunities.push(item)
        } else if (currentSection === 'threats' && artifacts.swotAnalysis.threats) {
          artifacts.swotAnalysis.threats.push(item)
        }
      } else if (currentArtifact === 'empathyMap') {
        if (currentSection === 'says' && artifacts.empathyMap.says) {
          artifacts.empathyMap.says.push(item)
        } else if (currentSection === 'thinks' && artifacts.empathyMap.thinks) {
          artifacts.empathyMap.thinks.push(item)
        } else if (currentSection === 'does' && artifacts.empathyMap.does) {
          artifacts.empathyMap.does.push(item)
        } else if (currentSection === 'feels' && artifacts.empathyMap.feels) {
          artifacts.empathyMap.feels.push(item)
        }
      } else if (currentArtifact === 'valuePropositionCanvas') {
        if (currentSection === 'productsandservices' && artifacts.valuePropositionCanvas.valueMap.productsAndServices) {
          artifacts.valuePropositionCanvas.valueMap.productsAndServices.push(item)
        } else if (currentSection === 'painrelievers' && artifacts.valuePropositionCanvas.valueMap.painRelievers) {
          artifacts.valuePropositionCanvas.valueMap.painRelievers.push(item)
        } else if (currentSection === 'gaincreators' && artifacts.valuePropositionCanvas.valueMap.gainCreators) {
          artifacts.valuePropositionCanvas.valueMap.gainCreators.push(item)
        } else if (currentSection === 'customerjobs' && artifacts.valuePropositionCanvas.customerProfile.customerJobs) {
          artifacts.valuePropositionCanvas.customerProfile.customerJobs.push(item)
        } else if (currentSection === 'customerpains' && artifacts.valuePropositionCanvas.customerProfile.customerPains) {
          artifacts.valuePropositionCanvas.customerProfile.customerPains.push(item)
        } else if (currentSection === 'customergains' && artifacts.valuePropositionCanvas.customerProfile.customerGains) {
          artifacts.valuePropositionCanvas.customerProfile.customerGains.push(item)
        }
      }
    }

    // Handle competitive analysis table parsing (separate from list items)
    else if (currentArtifact === 'competitiveAnalysis' && trimmed.startsWith('|') && trimmed.includes('|')) {
      const cells = trimmed.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0)
      if (cells.length > 1) {
        if (!artifacts.competitiveAnalysis.headers.length) {
          artifacts.competitiveAnalysis.headers = cells
        } else if (!cells.every(cell => cell.match(/^[-]+$/))) {
          artifacts.competitiveAnalysis.rows.push({ feature: cells[0], values: cells.slice(1) })
        }
      }
    }
  }

  console.log('Final parsed artifacts:', artifacts)
  return artifacts
}

const parseProjectionsSection = (projectionsContent) => {
  console.log('Parsing projections section:', projectionsContent)
  console.log('Projections content length:', projectionsContent.length)

  // Use the new ProjectionsParser class instead of the old logic
  const parser = new ProjectionsParser()
  const result = parser.parse(projectionsContent)

  console.log('Parser result:', result)
  console.log('Metrics in result:', result.metrics ? result.metrics.length : 'undefined')

  // Update the app's metrics
  metrics.value = result.metrics || []

  // Update metadata if available
  if (result.selectedMetricId) {
    // Validate that the selectedMetricId exists in the metrics array
    const metricExists = metrics.value.some(m => m.id === result.selectedMetricId)
    selectedMetricId.value = metricExists ? result.selectedMetricId : null
  }
  if (result.viewMode) {
    viewMode.value = result.viewMode
  }
  if (result.chartMetrics && Array.isArray(result.chartMetrics)) {
    chartMetrics.value.splice(0, chartMetrics.value.length, ...result.chartMetrics)
  }

  console.log('After parsing, metrics.value:', metrics.value)
  console.log('Final metrics count:', metrics.value.length)

  return result
}
</script>
