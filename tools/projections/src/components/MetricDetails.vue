<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Metric Details</h2>
      <div class="flex gap-2">
        <button @click="moveMetricUp" v-if="selectedMetric && canMoveUp"
                class="p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button @click="moveMetricDown" v-if="selectedMetric && canMoveDown"
                class="p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
          <i class="fas fa-arrow-down"></i>
        </button>
        <button @click="$emit('toggle-chart')"
                :class="{ 'p-2 rounded border text-sm': true, 'bg-blue-600 text-white border-blue-600': selectedMetric && chartMetrics.includes(selectedMetric.id), 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800': !(selectedMetric && chartMetrics.includes(selectedMetric.id)) }">
          <i class="fas fa-chart-line"></i>
        </button>
        <button @click="$emit('toggle-edit')"
                class="px-3 py-1 bg-blue-600 text-white rounded text-sm border border-blue-600">
          <i class="fas fa-pencil-alt mr-1"></i> {{ editMode ? 'Save' : 'Edit' }}
        </button>
        <button v-if="selectedMetric" @click="deleteMetric"
                class="p-2 rounded border border-red-500 text-red-500 text-sm hover:bg-red-50">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div v-if="selectedMetric" class="space-y-4">
      <!-- Metric Name -->
      <div v-if="editMode && selectedMetric" class="mb-4">
        <label class="block text-sm font-medium mb-1">Metric Name</label>
        <input v-model="selectedMetric.name" @input="$emit('recalculate')"
               class="w-full px-3 py-2 border border-gray-300 rounded text-lg font-semibold">
      </div>
      <div v-else-if="selectedMetric" class="mb-4">
        <h3 class="text-xl font-semibold">{{ selectedMetric.name }}</h3>
      </div>

      <!-- Description -->
      <div v-if="editMode && selectedMetric">
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="selectedMetric.description" @input="$emit('recalculate')"
                  rows="2" class="w-full px-3 py-2 border border-gray-300 rounded"></textarea>
      </div>
      <div v-else-if="selectedMetric && selectedMetric.description" class="text-gray-600 text-sm">
        {{ selectedMetric.description }}
      </div>

      <!-- Type and Unit -->
      <div v-if="editMode && selectedMetric" class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Type</label>
          <select :value="currentType" @change="$emit('update-type', $event)"
                  class="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="variable">Variable</option>
            <option value="calculated">Calculated</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Unit</label>
          <select v-model="selectedMetric.unit" @change="$emit('recalculate')"
                  class="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="">No unit</option>
            <option value="units">units</option>
            <option value="€">€</option>
            <option value="$">$</option>
            <option value="%">%</option>
            <option value="customers">customers</option>
            <option value="custom">Custom...</option>
          </select>
          <input v-if="selectedMetric.unit === 'custom'" v-model="selectedMetric.unit"
                 @input="$emit('recalculate')" placeholder="Enter custom unit"
                 class="w-full mt-1 px-3 py-2 border border-gray-300 rounded">
        </div>
      </div>

      <!-- Aggregation -->
      <div v-if="editMode && selectedMetric">
        <label class="block text-sm font-medium mb-1">Yearly Aggregation</label>
        <select v-model="selectedMetric.yearlyAggregation" @change="$emit('recalculate')"
                class="w-full px-3 py-2 border border-gray-300 rounded">
          <option value="last">Last value of year</option>
          <option value="sum">Sum of monthly values</option>
          <option value="average">Average of monthly values</option>
        </select>
      </div>

      <!-- Formula Builder for Calculated -->
      <div v-if="editMode && currentType === 'calculated' && selectedMetric">
        <label class="block text-sm font-medium mb-2">Formula Builder</label>
        <div class="flex gap-2 items-center flex-wrap">
          <select :value="formulaMetric1" @change="updateFormulaMetric1"
                  class="px-2 py-1 border border-gray-300 rounded text-sm">
            <option value="">Select metric...</option>
            <option v-for="m in metrics" :value="m.slug" :key="m.id">{{ m.name }}</option>
          </select>
          <select :value="formulaOffset1" @change="updateFormulaOffset1"
                  class="px-2 py-1 border border-gray-300 rounded text-sm">
            <option v-for="offset in offsetOptions" :value="offset" :key="offset">{{ offset }}</option>
          </select>
          <select :value="formulaOperation" @change="updateFormulaOperation"
                  class="px-2 py-1 border border-gray-300 rounded text-sm">
            <option value="+">+</option>
            <option value="*">×</option>
          </select>
          <select :value="formulaMetric2" @change="updateFormulaMetric2"
                  class="px-2 py-1 border border-gray-300 rounded text-sm">
            <option value="">Select metric...</option>
            <option v-for="m in metrics" :value="m.slug" :key="m.id">{{ m.name }}</option>
          </select>
          <select :value="formulaOffset2" @change="updateFormulaOffset2"
                  class="px-2 py-1 border border-gray-300 rounded text-sm">
            <option v-for="offset in offsetOptions" :value="offset" :key="offset">{{ offset }}</option>
          </select>
        </div>
      </div>

      <!-- Formula Display -->
      <div v-else-if="selectedMetric && selectedMetric.formula" class="text-gray-600 text-sm italic">
        Formula: {{ getDetailedFormula(selectedMetric) }}
      </div>

      <!-- Values Section -->
      <h4 class="font-semibold mb-2">Values</h4>

      <!-- Calculated Values Display -->
      <div v-if="currentType === 'calculated' && selectedMetric" class="mb-6">
        <p class="text-sm text-gray-600">This metric is calculated automatically based on the formula above. Values are shown in the table.</p>
      </div>

      <!-- Variable Values Table -->
      <div v-if="editMode && currentType === 'variable' && selectedMetric" class="mb-6">
        <h5 class="font-semibold mb-3">Values by Year and Month</h5>
        <p class="text-sm text-gray-600 mb-4">Enter specific values for any month/year combination. Missing values will be interpolated automatically.</p>

        <div class="overflow-x-auto border border-gray-300 rounded">
          <table class="w-full text-xs">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-1 py-1 text-left font-medium border-b border-gray-300">Year</th>
                <th v-for="month in 12" :key="month" class="px-1 py-1 text-center font-medium border-b border-gray-300 min-w-10">
                  M{{ month }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="year in 5" :key="year" class="border-b border-gray-200">
                <td class="px-1 py-1 font-medium bg-gray-50 border-r border-gray-300 text-xs">
                  {{ year }}
                </td>
                <td v-for="month in 12" :key="month" class="px-1 py-1 text-center border-r border-gray-200 last:border-r-0">
                  <input
                    type="number"
                    step="any"
                    :value="getMetricValue(year, month)"
                    @input="setMetricValue(year, month, $event.target.value)"
                    class="w-full px-0.5 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="">
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium mb-1">Interpolation Method</label>
          <select v-model="selectedMetric.interpolation" @change="$emit('recalculate')"
                  class="px-3 py-2 border border-gray-300 rounded">
            <option value="linear">Linear Interpolation</option>
            <option value="curve">Curve Interpolation (Spline)</option>
          </select>
        </div>
      </div>

      <!-- Color Picker -->
      <div v-if="selectedMetric">
        <label class="block text-sm font-medium mb-1">Color</label>
        <select v-model="selectedMetric.color" @change="$emit('recalculate')"
                class="w-full px-3 py-2 border border-gray-300 rounded">
          <option value="#ffffff">White</option>
          <option value="#f8f9fa">Light Gray</option>
          <option value="#e9ecef">Gray 100</option>
          <option value="#dee2e6">Gray 200</option>
          <option value="#ced4da">Gray 300</option>
          <option value="#adb5bd">Gray 400</option>
          <option value="#6c757d">Gray 500</option>
          <option value="#495057">Gray 600</option>
          <option value="#343a40">Gray 700</option>
          <option value="#212529">Gray 800</option>
          <option value="#e3f2fd">Light Blue</option>
          <option value="#bbdefb">Blue 100</option>
          <option value="#90caf9">Blue 200</option>
          <option value="#64b5f6">Blue 300</option>
          <option value="#42a5f5">Blue 400</option>
          <option value="#2196f3">Blue 500</option>
          <option value="#1e88e5">Blue 600</option>
          <option value="#1976d2">Blue 700</option>
          <option value="#1565c0">Blue 800</option>
          <option value="#0d47a1">Blue 900</option>
          <!-- Add more color options as needed -->
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedMetric: Object,
  metrics: Array,
  editMode: Boolean,
  currentType: String,
  formulaMetric1: String,
  formulaOffset1: Number,
  formulaOperation: String,
  formulaMetric2: String,
  formulaOffset2: Number,
  offsetOptions: Array,
  chartMetrics: Array,
  getMetricValue: Function,
  setMetricValue: Function
})

const emit = defineEmits([
  'toggle-edit',
  'toggle-chart',
  'update-type',
  'update-formula',
  'recalculate',
  'set-metric-value',
  'get-metric-value',
  'update-formula-metric1',
  'update-formula-offset1',
  'update-formula-operation',
  'update-formula-metric2',
  'update-formula-offset2',
  'move-metric-up',
  'move-metric-down'
])

// Computed properties for move buttons
const selectedMetricIndex = computed(() => {
  if (!props.selectedMetric || !props.metrics) return -1
  return props.metrics.findIndex(m => m.id === props.selectedMetric.id)
})

const canMoveUp = computed(() => {
  return selectedMetricIndex.value > 0
})

const canMoveDown = computed(() => {
  return selectedMetricIndex.value >= 0 && selectedMetricIndex.value < props.metrics.length - 1
})

// Move functions
const moveMetricUp = () => {
  if (canMoveUp.value) {
    emit('move-metric-up', props.selectedMetric.id)
  }
}

const moveMetricDown = () => {
  if (canMoveDown.value) {
    emit('move-metric-down', props.selectedMetric.id)
  }
}

const getGrowth = (metric, phase) => {
  if (!metric || !metric.growths) return { growthType: 'additive', growthRate: 0 }
  let growth = metric.growths.find(g => g.phaseId === phase.id)
  if (!growth) {
    growth = { phaseId: phase.id, growthType: 'additive', growthRate: 0 }
    metric.growths.push(growth)
  }
  return growth
}

const getDetailedFormula = (metric) => {
  if (!metric || metric.type !== 'calculated') return ''

  if (metric.id === 'totalUnits') {
    return 'Total customers × Units per customer per month'
  } else if (metric.id === 'salesRevenue') {
    return 'Total units sold × Price per unit'
  } else if (metric.id === 'totalInflow') {
    return 'Sales revenue + Other inflows per month'
  } else if (metric.id === 'totalCogs') {
    return 'Total units sold × COGS per unit'
  } else if (metric.id === 'totalOutflow') {
    return 'Total COGS + Fixed costs + Other outflows per month'
  } else if (metric.id === 'cashBalance') {
    return 'Previous balance + Total inflow - Total outflow'
  }

  const parts = metric.formula?.split(' ') || []
  if (parts.length >= 3 && parts.length % 2 === 1) {
    // Complex formula: val op val op val...
    let description = ''
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Value
        const token = parts[i]
        if (token.includes(':')) {
          const [slug, offsetStr] = token.split(':')
          const offset = parseInt(offsetStr) || 0
          const m = props.metrics.find(m => m.slug === slug)
          if (m) {
            const offsetDesc = offset === 0 ? '' : offset < 0 ? ` (${Math.abs(offset)} months ago)` : ` (${offset} months ahead)`
            description += `${m.name}${offsetDesc}`
          } else {
            description += token
          }
        } else {
          description += token
        }
      } else {
        // Operator
        const op = parts[i]
        const opSymbol = op === '*' ? '×' : op === '/' ? '÷' : op
        description += ` ${opSymbol} `
      }
    }
    return description
  } else if (parts.length === 3) {
    // Simple 3-part formula
    const [slugOffset1, op, slugOffset2] = parts
    const [slug1, offset1Str] = slugOffset1.split(':')
    const [slug2, offset2Str] = slugOffset2.split(':')
    const offset1 = parseInt(offset1Str) || 0
    const offset2 = parseInt(offset2Str) || 0
    const m1 = props.metrics.find(m => m.slug === slug1)
    const m2 = props.metrics.find(m => m.slug === slug2)
    if (m1 && m2) {
      const offsetDesc1 = offset1 === 0 ? '' : offset1 < 0 ? ` (${Math.abs(offset1)} months ago)` : ` (${offset1} months ahead)`
      const offsetDesc2 = offset2 === 0 ? '' : offset2 < 0 ? ` (${Math.abs(offset2)} months ago)` : ` (${offset2} months ahead)`
      const opSymbol = op === '*' ? '×' : op === '/' ? '÷' : op
      return `${m1.name}${offsetDesc1} ${opSymbol} ${m2.name}${offsetDesc2}`
    }
  }
  return metric.formula || ''
}

// Functions are now passed as props

const deleteMetric = () => {
  if (props.selectedMetric && confirm(`Are you sure you want to delete "${props.selectedMetric.name}"?`)) {
    // This would need to be handled by parent component
    // For now, we'll emit an event
    console.log('Delete metric:', props.selectedMetric.id)
  }
}

const updateFormulaMetric1 = (event) => {
  emit('update-formula-metric1', event.target.value)
}

const updateFormulaOffset1 = (event) => {
  emit('update-formula-offset1', parseInt(event.target.value))
}

const updateFormulaOperation = (event) => {
  emit('update-formula-operation', event.target.value)
}

const updateFormulaMetric2 = (event) => {
  emit('update-formula-metric2', event.target.value)
}

const updateFormulaOffset2 = (event) => {
  emit('update-formula-offset2', parseInt(event.target.value))
}
</script>