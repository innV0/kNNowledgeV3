<template>
  <div class="bg-white rounded overflow-hidden shadow">
    <!-- Tag Filter Controls -->
    <div v-if="isFilterExpanded" class="p-2 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-gray-700">Filter by tags:</label>
          <select
            v-model="selectedFilterTags"
            multiple
            class="px-2 py-1 border border-gray-300 rounded text-xs min-w-40"
            @change="updateFilteredMetrics"
          >
            <option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </div>
        <button
          v-if="selectedFilterTags.length > 0"
          @click="clearTagFilters"
          class="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-100"
        >
          Clear
        </button>
        <span v-if="selectedFilterTags.length > 0" class="text-xs text-gray-600">
          {{ filteredMetrics.length }}/{{ metrics.length }}
        </span>
      </div>
    </div>

    <div class="overflow-x-auto overflow-y-visible">
      <table class="min-w-full text-xs">
        <thead>
          <tr>
            <th class="px-2 py-1.5 text-left font-semibold bg-gray-50 border-b border-gray-200 h-6 align-middle sticky w-64">
              Metric
            </th>
            <th class="px-2 py-1.5 text-left font-semibold bg-gray-50 border-b border-gray-200 h-6 align-middle w-40">
              Tags
            </th>
            <th
              v-for="period in periods"
              :key="period"
              class="px-1 py-1 text-center font-semibold bg-gray-50 border-b border-gray-200 h-6 align-middle min-w-10"
            >
              {{ viewMode === 'monthly' ? 'M' : 'Y' }}{{ period + 1 }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(metric, index) in filteredMetrics"
            :key="metric.id"
            :class="{
              'ring-1 ring-blue-500': selectedMetricId === metric.id,
              'cursor-pointer hover:bg-gray-50': true,
              'text-blue-600': metric.type === 'variable'
            }"
            :style="{ backgroundColor: metric.color }"
            @click="$emit('select-metric', metric.id)"
          >
            <td class="px-2 py-1 border-b border-gray-200 h-6 align-middle sticky bg-inherit w-64">
              <div class="truncate">
                {{ projections[metrics.indexOf(metric)]?.name }}
                <span v-if="metric.unit && metric.unit !== '$'" class="text-gray-600 text-xs ml-1">
                  ({{ metric.unit }})
                </span>
              </div>
            </td>
            <td class="px-2 py-1 border-b border-gray-200 h-6 align-middle w-40">
              <div class="flex flex-wrap gap-0.5">
                <span
                  v-for="tag in metric.tags.slice(0, 3)"
                  :key="tag"
                  class="inline-flex items-center px-1 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                >
                  {{ tag }}
                </span>
                <span v-if="metric.tags.length > 3" class="text-gray-400 text-xs">+{{ metric.tags.length - 3 }}</span>
                <span v-if="metric.tags.length === 0" class="text-gray-400 text-xs">-</span>
              </div>
            </td>
            <td
              v-for="period in periods"
              :key="period"
              class="px-1 py-1 text-right border-b border-gray-200 h-6 align-middle"
            >
              <span :class="{
                'text-green-600': metric.format?.colorize && getValue(projections[metrics.indexOf(metric)], period) > 0,
                'text-red-600': metric.format?.colorize && getValue(projections[metrics.indexOf(metric)], period) < 0
              }">
                {{ formatValue(getValue(projections[metrics.indexOf(metric)], period), metric.format) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>
/* Ensure sticky columns have proper background and borders */
table th.sticky,
table td.sticky {
  position: sticky;
  left: 0;
  z-index: 10;
  background: inherit;
}

table th.sticky {
  z-index: 20;
}

/* Selected row styling overrides */
tr.ring-blue-500 td.sticky {
  background: inherit;
}

/* Ensure table layout is correct */
table {
  table-layout: auto;
}

/* Percentage formatting */
.percentage::after {
  content: '%';
}
</style>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  metrics: Array,
  projections: Array,
  periods: Array,
  viewMode: String,
  selectedMetricId: String,
  formatValue: Function,
  isFilterExpanded: Boolean
})

const emit = defineEmits(['select-metric', 'toggle-filter'])

const selectedFilterTags = ref([])

// Computed property for available tags
const availableTags = computed(() => {
  const tagSet = new Set()
  props.metrics.forEach(metric => {
    metric.tags?.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

// Computed property for filtered metrics
const filteredMetrics = computed(() => {
  if (selectedFilterTags.value.length === 0) {
    return props.metrics
  }
  return props.metrics.filter(metric => {
    return selectedFilterTags.value.every(filterTag =>
      metric.tags?.includes(filterTag)
    )
  })
})

// Watch for metrics changes to update available tags
watch(() => props.metrics, () => {
  // Clear selected tags that no longer exist
  selectedFilterTags.value = selectedFilterTags.value.filter(tag =>
    availableTags.value.includes(tag)
  )
}, { deep: true })

const updateFilteredMetrics = () => {
  // This function is called when the select changes
  // The computed property will automatically update
}

const clearTagFilters = () => {
  selectedFilterTags.value = []
}

const toggleFilter = () => {
  emit('toggle-filter', !props.isFilterExpanded)
}


const getValue = (projection, period) => {
  if (props.viewMode === 'monthly') {
    return projection.values[period]
  } else {
    const yearStart = (period - 1) * 12
    const aggregation = projection.yearlyAggregation || 'last'
    if (aggregation === 'last') {
      return projection.values[yearStart + 11] || 0 // Last month of the year
    } else if (aggregation === 'sum') {
      let sum = 0
      for (let i = 0; i < 12; i++) {
        sum += projection.values[yearStart + i] || 0
      }
      return sum
    } else if (aggregation === 'average') {
      let sum = 0
      let count = 0
      for (let i = 0; i < 12; i++) {
        const val = projection.values[yearStart + i]
        if (val !== undefined) {
          sum += val
          count++
        }
      }
      return count > 0 ? sum / count : 0
    }
    return projection.values[yearStart + 11] || 0 // Fallback to last
  }
}

</script>