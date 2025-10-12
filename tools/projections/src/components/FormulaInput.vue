<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium">Formula</label>

    <!-- Formula Input -->
    <div class="relative">
      <textarea
        v-model="formulaText"
        @input="onFormulaChange"
        @keydown="handleKeydown"
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
        :class="[
          'w-full px-3 py-2 border rounded font-mono text-sm resize-none',
          validation.valid ? 'border-gray-300' : 'border-red-500'
        ]"
        rows="3"
        placeholder="Enter formula: Revenue:0 / Users:0 or SUM(Revenue:0, 3)"
      ></textarea>

      <!-- Suggestions Dropdown -->
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-40 overflow-y-auto"
        style="top: 100%;"
      >
        <div
          v-for="suggestion in suggestions"
          :key="suggestion.text"
          @mousedown="insertSuggestion(suggestion)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          <span class="font-mono">{{ suggestion.text }}</span>
          <span class="text-gray-500 ml-2">{{ suggestion.description }}</span>
        </div>
      </div>
    </div>

    <!-- Validation Status -->
    <div class="flex items-center gap-2 text-sm">
      <span v-if="validation.valid" class="text-green-600">
        <i class="fas fa-check-circle mr-1"></i>
        Valid formula
      </span>
      <span v-else-if="validation.error" class="text-red-600">
        <i class="fas fa-exclamation-triangle mr-1"></i>
        {{ validation.error }}
      </span>
      <span v-else class="text-gray-500">
        <i class="fas fa-clock mr-1"></i>
        Checking...
      </span>
    </div>

    <!-- Formula Preview -->
    <div v-if="validation.valid && previewValue !== null" class="text-sm text-gray-600">
      <strong>Preview:</strong> {{ formatPreview(previewValue) }}
      <span class="text-xs text-gray-500 ml-2">
        (Current period calculation)
      </span>
    </div>

    <!-- Help Text -->
    <div class="text-xs text-gray-500 space-y-1">
      <div><strong>Operators:</strong> +, -, *, /, // (integer div), %, ^ (power)</div>
      <div><strong>Functions:</strong> SUM(metric, periods), AVG(metric, periods), GROWTH(metric, periods), PCT_CHANGE(metric), ROI(return, cost), MARGIN(num, den)</div>
      <div><strong>Metrics:</strong> Use metricName:offset (e.g., Revenue:0, Users:-1)</div>
      <div><strong>Examples:</strong> (Revenue:0 - Costs:0) / Revenue:0, GROWTH(Users:0, 12)</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { FormulaParser } from '../composables/formulaParser.js'

const props = defineProps({
  modelValue: String,
  metrics: Array,
  currentPeriod: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'valid-change'])

const formulaText = ref(props.modelValue || '')
const showSuggestions = ref(false)
const validation = ref({ valid: true, error: null })
const previewValue = ref(null)

// Create parser instance
const parser = computed(() => new FormulaParser(props.metrics))

// Validation and preview
const validateAndPreview = async () => {
  if (!formulaText.value.trim()) {
    validation.value = { valid: true, error: null }
    previewValue.value = null
    emit('valid-change', true)
    return
  }

  try {
    const result = parser.value.validate(formulaText.value)
    validation.value = result

    if (result.valid) {
      // Calculate preview for current period
      try {
        previewValue.value = parser.value.evaluate(result.ast, props.currentPeriod)
      } catch (evalError) {
        previewValue.value = null
        console.warn('Preview calculation failed:', evalError.message)
      }
    } else {
      previewValue.value = null
    }

    emit('valid-change', result.valid)
  } catch (error) {
    validation.value = { valid: false, error: error.message }
    previewValue.value = null
    emit('valid-change', false)
  }
}

// Suggestions
const suggestions = computed(() => {
  if (!showSuggestions.value || !formulaText.value) return []

  const suggestions = []

  // Metric suggestions
  props.metrics.forEach(metric => {
    suggestions.push({
      text: metric.slug + ':0',
      description: metric.name,
      type: 'metric'
    })
  })

  // Function suggestions
  const functions = [
    { name: 'SUM', desc: 'Sum of N periods' },
    { name: 'AVG', desc: 'Average of N periods' },
    { name: 'MIN', desc: 'Minimum of N periods' },
    { name: 'MAX', desc: 'Maximum of N periods' },
    { name: 'GROWTH', desc: 'Compound growth rate' },
    { name: 'DELTA', desc: 'Change from previous period' },
    { name: 'PCT_CHANGE', desc: 'Percentage change' },
    { name: 'ROI', desc: 'Return on investment' },
    { name: 'MARGIN', desc: 'Margin calculation' },
    { name: 'RATIO', desc: 'Ratio calculation' },
    { name: 'CUMULATIVE', desc: 'Cumulative sum' },
    { name: 'MOVING_AVG', desc: 'Moving average' }
  ]

  functions.forEach(func => {
    suggestions.push({
      text: func.name + '(',
      description: func.desc,
      type: 'function'
    })
  })

  // Operator suggestions
  const operators = ['+', '-', '*', '/', '//', '%', '^', '(', ')']
  operators.forEach(op => {
    suggestions.push({
      text: op,
      description: 'Operator',
      type: 'operator'
    })
  })

  return suggestions.slice(0, 10) // Limit to 10 suggestions
})

// Event handlers
const onFormulaChange = () => {
  emit('update:modelValue', formulaText.value)
  validateAndPreview()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    showSuggestions.value = false
  } else if (event.key === 'Enter' && event.ctrlKey) {
    // Ctrl+Enter to accept first suggestion
    if (suggestions.value.length > 0) {
      event.preventDefault()
      insertSuggestion(suggestions.value[0])
    }
  }
}

const hideSuggestions = () => {
  // Delay hiding to allow click events
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

const insertSuggestion = (suggestion) => {
  // Simple insertion - replace current word or append
  const cursorPos = formulaText.value.length
  const beforeCursor = formulaText.value.substring(0, cursorPos)
  const afterCursor = formulaText.value.substring(cursorPos)

  formulaText.value = beforeCursor + suggestion.text + afterCursor
  showSuggestions.value = false
  onFormulaChange()
}

const formatPreview = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A'

  // Simple formatting
  if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M'
  } else if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K'
  } else {
    return value.toFixed(2)
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== formulaText.value) {
    formulaText.value = newValue || ''
    validateAndPreview()
  }
})

watch(() => props.metrics, () => {
  validateAndPreview()
}, { deep: true })

// Initial validation
onMounted(() => {
  validateAndPreview()
})
</script>

<style scoped>
/* Custom styling for the formula input */
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.suggestion-item:hover {
  background-color: #f3f4f6;
}
</style>