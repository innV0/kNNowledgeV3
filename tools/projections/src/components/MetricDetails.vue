<template>
  <div class="text-sm">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-semibold">Metric Details</h2>
      <div class="flex gap-1">
        <button @click="moveMetricUp" v-if="selectedMetric && canMoveUp"
                class="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 text-xs">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button @click="moveMetricDown" v-if="selectedMetric && canMoveDown"
                class="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 text-xs">
          <i class="fas fa-arrow-down"></i>
        </button>
        <button @click="$emit('toggle-chart')"
                :class="{ 'p-1.5 rounded border text-xs': true, 'bg-blue-600 text-white border-blue-600': selectedMetric && chartMetrics.includes(selectedMetric.id), 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800': !(selectedMetric && chartMetrics.includes(selectedMetric.id)) }">
          <i class="fas fa-chart-line"></i>
        </button>
        <button @click="$emit('toggle-edit')"
                class="px-2 py-1 bg-blue-600 text-white rounded text-xs border border-blue-600">
          <i class="fas fa-pencil-alt mr-1"></i> {{ editMode ? 'Save' : 'Edit' }}
        </button>
        <button v-if="selectedMetric" @click="deleteMetric"
                class="p-1.5 rounded border border-red-500 text-red-500 text-xs hover:bg-red-50">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div v-if="selectedMetric" class="space-y-3">
      <!-- Metric Name -->
      <div v-if="editMode && selectedMetric" class="mb-2">
        <label class="block text-xs font-medium mb-1">Metric Name</label>
        <input v-model="selectedMetric.name" @input="$emit('recalculate')"
               class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-semibold">
      </div>
      <div v-else-if="selectedMetric" class="mb-2">
        <h3 class="text-base font-semibold">{{ selectedMetric.name }}</h3>
      </div>

      <!-- Description -->
      <div v-if="editMode && selectedMetric">
        <label class="block text-xs font-medium mb-1">Description</label>
        <textarea v-model="selectedMetric.description" @input="$emit('recalculate')"
                  rows="2" class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"></textarea>
      </div>
      <div v-else-if="selectedMetric && selectedMetric.description" class="text-gray-600 text-xs">
        {{ selectedMetric.description }}
      </div>

      <!-- Type and Unit -->
      <div v-if="editMode && selectedMetric" class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-medium mb-1">Type</label>
          <select :value="currentType" @change="$emit('update-type', $event)"
                  class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
            <option value="variable">Variable</option>
            <option value="calculated">Calculated</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Unit</label>
          <select v-model="unitSelection" @change="onUnitChange"
                  class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
            <option value="">No unit</option>
            <option value="units">units</option>
            <option value="€">€</option>
            <option value="$">$</option>
            <option value="%">%</option>
            <option value="customers">customers</option>
            <option value="custom">Custom...</option>
          </select>
          <input v-if="unitSelection === 'custom'" v-model="customUnitInput"
                 @input="updateCustomUnit" placeholder="Enter custom unit"
                 class="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded text-sm">
        </div>
      </div>

      <!-- Aggregation -->
      <div v-if="editMode && selectedMetric">
        <label class="block text-xs font-medium mb-1">Yearly Aggregation</label>
        <select v-model="selectedMetric.yearlyAggregation" @change="$emit('recalculate')"
                class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
          <option value="last">Last value of year</option>
          <option value="sum">Sum of monthly values</option>
          <option value="average">Average of monthly values</option>
        </select>
      </div>

      <!-- Enhanced Formula Input for Calculated -->
      <div v-if="editMode && currentType === 'calculated' && selectedMetric">
        <FormulaInput
          :modelValue="selectedMetric.formula || ''"
          :metrics="metrics"
          :currentPeriod="0"
          @update:modelValue="updateFormula"
          @valid-change="formulaValid = $event"
        />
      </div>

      <!-- Formula Display -->
      <div v-else-if="selectedMetric && selectedMetric.formula" class="text-gray-600 text-xs italic">
        Formula: {{ getDetailedFormula(selectedMetric) }}
      </div>

      <!-- Values Section -->
      <h4 class="font-semibold mb-1 text-sm">Values</h4>

      <!-- Calculated Values Display -->
      <div v-if="currentType === 'calculated' && selectedMetric" class="mb-3">
        <p class="text-xs text-gray-600">This metric is calculated automatically based on the formula above. Values are shown in the table.</p>
      </div>

      <!-- Variable Values Table -->
      <div v-if="editMode && currentType === 'variable' && selectedMetric" class="mb-3">
        <h5 class="font-semibold mb-2 text-sm">Values by Year and Month</h5>
        <p class="text-xs text-gray-600 mb-2">Enter specific values for any month/year combination. Missing values will be interpolated automatically.</p>

        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-1 py-1 text-left font-medium text-xs">Year</th>
                <th v-for="month in 12" :key="month" class="px-1 py-1 text-center font-medium min-w-8 text-xs">
                  M{{ month }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="year in 5" :key="year">
                <td class="px-1 py-1 font-medium bg-gray-50 text-xs">
                  {{ year }}
                </td>
                <td v-for="month in 12" :key="month" class="px-1 py-1 text-center">
                  <input
                    type="number"
                    step="any"
                    :value="getMetricValue(year, month)"
                    @input="setMetricValue(year, month, $event.target.value)"
                    :class="{
                      'w-full px-0.5 py-0.5 text-xs border-none rounded focus:outline-none focus:ring-1 focus:ring-blue-500': true,
                      'bg-blue-50': getMetricValue(year, month) !== '',
                      'bg-white': getMetricValue(year, month) === ''
                    }"
                    placeholder="">
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-2">
          <label class="block text-xs font-medium mb-1">Interpolation Method</label>
          <select v-model="selectedMetric.interpolation" @change="$emit('recalculate')"
                  class="px-2 py-1.5 border border-gray-300 rounded text-sm">
            <option value="none">No Interpolation (Individual Values)</option>
            <option value="linear">Linear Interpolation</option>
            <option value="curve">Curve Interpolation (Spline)</option>
          </select>
        </div>
      </div>

      <!-- Color Picker -->
      <div v-if="selectedMetric">
        <label class="block text-xs font-medium mb-1">Color</label>
        <select v-model="selectedMetric.color" @change="$emit('recalculate')"
                class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
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
        </select>
      </div>

      <!-- Tags -->
      <div v-if="selectedMetric">
        <label class="block text-xs font-medium mb-1">Tags</label>
        <div v-if="editMode" class="space-y-1">
          <input
            v-model="newTag"
            @keydown.enter="addTag"
            @keydown="handleTagInput"
            placeholder="Add a tag and press Enter"
            class="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
          >
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in selectedMetric.tags"
              :key="tag"
              class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              {{ tag }}
              <button
                @click="removeTag(tag)"
                class="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          </div>
        </div>
        <div v-else class="flex flex-wrap gap-1">
          <span
            v-for="tag in selectedMetric.tags"
            :key="tag"
            class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800"
          >
            {{ tag }}
          </span>
          <span v-if="selectedMetric.tags.length === 0" class="text-gray-500 text-xs">No tags</span>
          </div>
        </div>
  
        <!-- Value Formatting -->
        <div v-if="selectedMetric">
          <label class="block text-sm font-medium mb-2">Value Formatting</label>
          <div v-if="editMode" class="space-y-4 p-4 border border-gray-200 rounded">
            <!-- Format Presets -->
            <div>
              <label class="block text-sm font-medium mb-1">Quick Presets</label>
              <div class="flex flex-wrap gap-2">
                <button @click="applyFormatPreset('default')" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">Default</button>
                <button @click="applyFormatPreset('currency')" class="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded">Currency</button>
                <button @click="applyFormatPreset('percentage')" class="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 rounded">Percentage</button>
                <button @click="applyFormatPreset('compact')" class="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 rounded">Compact</button>
                <button @click="applyFormatPreset('scientific')" class="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 rounded">Scientific</button>
              </div>
            </div>
  
            <!-- Decimal Places -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Decimal Places</label>
                <select v-model="selectedMetric.format.decimals" @change="$emit('recalculate')" class="w-full px-3 py-2 border border-gray-300 rounded">
                  <option :value="0">0 decimals</option>
                  <option :value="1">1 decimal</option>
                  <option :value="2">2 decimals</option>
                  <option :value="3">3 decimals</option>
                </select>
              </div>
  
              <!-- Rounding Method -->
              <div>
                <label class="block text-sm font-medium mb-1">Rounding</label>
                <select v-model="selectedMetric.format.rounding" @change="$emit('recalculate')" class="w-full px-3 py-2 border border-gray-300 rounded">
                  <option value="round">Round</option>
                  <option value="floor">Floor</option>
                  <option value="ceil">Ceil</option>
                  <option value="trunc">Truncate</option>
                </select>
              </div>
            </div>
  
            <!-- Display Options -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Currency Symbol -->
              <div>
                <label class="block text-sm font-medium mb-1">Currency Symbol</label>
                <select v-model="selectedMetric.format.currency" @change="$emit('recalculate')" class="w-full px-3 py-2 border border-gray-300 rounded">
                  <option value="">None</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="¥">¥ (JPY)</option>
                  <option value="custom">Custom...</option>
                </select>
                <input v-if="selectedMetric.format.currency === 'custom'" v-model="customCurrencySymbol"
                       @input="updateCustomCurrency" placeholder="Enter symbol"
                       class="w-full mt-1 px-3 py-2 border border-gray-300 rounded">
              </div>
  
              <!-- Compact Notation -->
              <div>
                <label class="block text-sm font-medium mb-1">Compact Notation</label>
                <select v-model="selectedMetric.format.compact" @change="$emit('recalculate')" class="w-full px-3 py-2 border border-gray-300 rounded">
                  <option :value="false">Disabled</option>
                  <option :value="true">Enabled (K/M/B/T)</option>
                </select>
              </div>
            </div>
  
            <!-- Special Formats -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Percentage -->
              <div>
                <label class="block text-sm font-medium mb-1">Percentage</label>
                <select v-model="selectedMetric.format.percentage" @change="$emit('recalculate')" class="w-full px-3 py-2 border border-gray-300 rounded">
                  <option :value="false">No</option>
                  <option :value="true">Yes (add %)</option>
                </select>
              </div>
  
              <!-- Scientific Notation -->
              <div>
                <label class="block text-sm font-medium mb-1">Scientific Notation</label>
                <select v-model="selectedMetric.format.scientific" @change="$emit('recalculate')" class="w-full px-3 py-2 border border-gray-300 rounded">
                  <option :value="false">No</option>
                  <option :value="true">Yes</option>
                </select>
              </div>
            </div>
  
            <!-- Advanced Options -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Color Coding -->
              <div>
                <label class="block text-sm font-medium mb-1">Color Coding</label>
                <select v-model="selectedMetric.format.colorize" @change="$emit('recalculate')" class="w-full px-3 py-2 border border-gray-300 rounded">
                  <option :value="false">No colors</option>
                  <option :value="true">Green/Red for +/-</option>
                </select>
              </div>
  
              <!-- Minimum Threshold -->
              <div>
                <label class="block text-sm font-medium mb-1">Min Threshold</label>
                <input v-model.number="selectedMetric.format.minThreshold" @input="$emit('recalculate')"
                       type="number" step="0.01" min="0" placeholder="0.01"
                       class="w-full px-3 py-2 border border-gray-300 rounded">
                <p class="text-xs text-gray-500 mt-1">Show "< value" for smaller numbers</p>
              </div>
            </div>
  
            <!-- Custom Suffix -->
            <div>
              <label class="block text-sm font-medium mb-1">Custom Suffix</label>
              <input v-model="selectedMetric.format.suffix" @input="$emit('recalculate')"
                     placeholder="e.g., per month, total, etc."
                     class="w-full px-3 py-2 border border-gray-300 rounded">
            </div>
  
            <!-- Format Preview -->
            <div class="mt-4 p-3 bg-gray-50 rounded">
              <label class="block text-sm font-medium mb-2">Preview</label>
              <div class="grid grid-cols-3 gap-2 text-sm">
                <div>Positive: <span class="font-mono">{{ formatPreview(1234.567) }}</span></div>
                <div>Negative: <span class="font-mono">{{ formatPreview(-1234.567) }}</span></div>
                <div>Small: <span class="font-mono">{{ formatPreview(0.00123) }}</span></div>
              </div>
            </div>
          </div>
  
          <!-- Read-only format display -->
          <div v-else class="text-sm text-gray-600">
            <div class="flex flex-wrap gap-1">
              <span v-if="selectedMetric.format.currency" class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Currency: {{ selectedMetric.format.currency === 'custom' ? customCurrencySymbol : selectedMetric.format.currency }}
              </span>
              <span v-if="selectedMetric.format.percentage" class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Percentage
              </span>
              <span v-if="selectedMetric.format.compact" class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                Compact
              </span>
              <span v-if="selectedMetric.format.scientific" class="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                Scientific
              </span>
              <span v-if="selectedMetric.format.colorize" class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                Color Coding
              </span>
              <span v-if="selectedMetric.format.decimals !== 2" class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                {{ selectedMetric.format.decimals }} decimals
              </span>
              <span v-if="selectedMetric.format.suffix" class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                "{{ selectedMetric.format.suffix }}"
              </span>
            </div>
            <p v-if="!hasActiveFormats" class="text-gray-500">Default formatting</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import FormulaInput from './FormulaInput.vue'

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

const newTag = ref('')
const customUnitInput = ref('')
const unitSelection = ref('')
const customCurrencySymbol = ref('')
const formulaValid = ref(true)

// Watch for selectedMetric changes to sync unit selection and custom unit input
watch(() => props.selectedMetric, (newMetric) => {
  if (newMetric) {
    if (!newMetric.unit) {
      unitSelection.value = ''
      customUnitInput.value = ''
    } else if (['', 'units', '€', '$', '%', 'customers'].includes(newMetric.unit)) {
      unitSelection.value = newMetric.unit
      customUnitInput.value = ''
    } else {
      // Custom unit
      unitSelection.value = 'custom'
      customUnitInput.value = newMetric.unit
    }
  }
}, { immediate: true })

const emit = defineEmits([
  'toggle-edit',
  'toggle-chart',
  'update-type',
  'update-formula',
  'recalculate',
  'set-metric-value',
  'get-metric-value',
  'update-formula',
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

const updateFormula = (newFormula) => {
  emit('update-formula', newFormula)
}

// Unit management functions
const onUnitChange = () => {
  if (unitSelection.value === 'custom') {
    // When switching to custom, initialize the input with current unit if it's a custom unit
    if (props.selectedMetric.unit && !['', 'units', '€', '$', '%', 'customers'].includes(props.selectedMetric.unit)) {
      customUnitInput.value = props.selectedMetric.unit
    } else {
      customUnitInput.value = ''
    }
  } else {
    // For non-custom units, update the metric unit directly
    props.selectedMetric.unit = unitSelection.value
    customUnitInput.value = ''
    emit('recalculate')
  }
}

const updateCustomUnit = () => {
  // Update the selectedMetric.unit with the custom input value
  props.selectedMetric.unit = customUnitInput.value || ''
  emit('recalculate')
}

// Tag management functions
const addTag = () => {
  const tag = newTag.value.trim().toLowerCase()
  if (tag && props.selectedMetric && !props.selectedMetric.tags.includes(tag)) {
    props.selectedMetric.tags.push(tag)
    newTag.value = ''
    emit('recalculate')
  }
}

const removeTag = (tagToRemove) => {
  if (props.selectedMetric) {
    const index = props.selectedMetric.tags.indexOf(tagToRemove)
    if (index > -1) {
      props.selectedMetric.tags.splice(index, 1)
      emit('recalculate')
    }
  }
}

const handleTagInput = (event) => {
  if (event.key === ',' || event.key === ';') {
    event.preventDefault()
    addTag()
  }
}

// Format management functions
const applyFormatPreset = (preset) => {
  if (!props.selectedMetric) return

  const format = props.selectedMetric.format
  switch (preset) {
    case 'default':
      Object.assign(format, {
        decimals: 2,
        compact: false,
        currency: '',
        percentage: false,
        scientific: false,
        suffix: '',
        rounding: 'round',
        colorize: false,
        minThreshold: 0.01
      })
      break
    case 'currency':
      Object.assign(format, {
        decimals: 2,
        compact: false,
        currency: '$',
        percentage: false,
        scientific: false,
        suffix: '',
        rounding: 'round',
        colorize: true,
        minThreshold: 0.01
      })
      break
    case 'percentage':
      Object.assign(format, {
        decimals: 1,
        compact: false,
        currency: '',
        percentage: true,
        scientific: false,
        suffix: '',
        rounding: 'round',
        colorize: false,
        minThreshold: 0.01
      })
      break
    case 'compact':
      Object.assign(format, {
        decimals: 1,
        compact: true,
        currency: '$',
        percentage: false,
        scientific: false,
        suffix: '',
        rounding: 'round',
        colorize: true,
        minThreshold: 0.01
      })
      break
    case 'scientific':
      Object.assign(format, {
        decimals: 2,
        compact: false,
        currency: '',
        percentage: false,
        scientific: true,
        suffix: '',
        rounding: 'round',
        colorize: false,
        minThreshold: 0.0001
      })
      break
  }
  emit('recalculate')
}

const updateCustomCurrency = () => {
  if (props.selectedMetric) {
    props.selectedMetric.format.currency = customCurrencySymbol.value || ''
    emit('recalculate')
  }
}

const formatPreview = (value) => {
  if (!props.selectedMetric) return value.toString()
  // Simple preview formatting
  const format = props.selectedMetric.format
  let result = value

  if (format.compact) {
    const absVal = Math.abs(value)
    if (absVal >= 1e9) result = (value / 1e9).toFixed(1) + 'B'
    else if (absVal >= 1e6) result = (value / 1e6).toFixed(1) + 'M'
    else if (absVal >= 1e3) result = (value / 1e3).toFixed(1) + 'K'
    else result = value.toFixed(format.decimals)
  } else {
    result = value.toFixed(format.decimals)
  }

  if (format.currency && format.currency !== 'custom') result = format.currency + result
  if (format.percentage) result += '%'
  if (format.suffix) result += ' ' + format.suffix

  return result
}

const hasActiveFormats = computed(() => {
  if (!props.selectedMetric) return false
  const format = props.selectedMetric.format
  return format.currency || format.percentage || format.compact || format.scientific ||
         format.colorize || format.decimals !== 2 || format.suffix
})
</script>

<style scoped>
/* Ensure table layout is correct */
table {
  table-layout: auto;
}

/* Percentage formatting */
.percentage::after {
  content: '%';
}

/* Hide number input arrows/spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>