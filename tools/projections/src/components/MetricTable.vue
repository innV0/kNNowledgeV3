<template>
  <div class="bg-white rounded-lg overflow-hidden shadow">
    <div class="overflow-x-auto overflow-y-visible">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-3 py-2 text-left font-semibold bg-gray-50 border-b border-gray-200 h-8 align-middle sticky w-80">
              Metric
            </th>
            <th
              v-for="period in periods"
              :key="period"
              class="px-2 py-1 text-center font-semibold bg-gray-50 border-b border-gray-200 h-8 align-middle min-w-12"
            >
              {{ viewMode === 'monthly' ? 'Month' : 'Year' }} {{ period }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(metric, index) in metrics"
            :key="metric.id"
            :class="{
              'ring-2 ring-blue-500': selectedMetricId === metric.id,
              'cursor-pointer hover:bg-gray-50': true,
              'text-blue-600': metric.type === 'variable'
            }"
            :style="{ backgroundColor: metric.color }"
            @click="$emit('select-metric', metric.id)"
          >
            <td class="px-3 py-1 border-b border-gray-200 h-8 align-middle sticky bg-inherit w-80">
              {{ projections[index]?.name }}
              <span v-if="metric.unit && metric.unit !== '$'" class="text-gray-600 text-sm">
                ({{ metric.unit }})
              </span>
            </td>
            <td
              v-for="period in periods"
              :key="period"
              class="px-2 py-1 text-right border-b border-gray-200 h-8 align-middle"
            >
              <span :class="{ 'after:content-[\'$\']': projections[index]?.isCurrency }">
                {{ formatValue(getValue(projections[index], period), projections[index]?.isCurrency) }}
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
</style>

<script setup>
const props = defineProps({
  metrics: Array,
  projections: Array,
  periods: Array,
  viewMode: String,
  selectedMetricId: String
})

const emit = defineEmits(['select-metric'])

const formatValue = (val, isCurrency) => {
  if (typeof val !== 'number' || isNaN(val)) {
    return '0'
  }
  if (isCurrency) {
    return Math.round(val).toString()
  }

  // Smart decimal formatting based on magnitude
  const absVal = Math.abs(val)
  if (absVal >= 100) {
    // 3+ digits: no decimals
    return Math.round(val).toString()
  } else if (absVal >= 10) {
    // 2 digits: 1 decimal
    return val.toFixed(1)
  } else {
    // < 10: 2 decimals, but remove trailing zeros
    const fixed = val.toFixed(2)
    return fixed.replace(/\.?0+$/, '')
  }
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