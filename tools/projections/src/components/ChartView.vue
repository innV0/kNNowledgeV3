<template>
  <div class="bg-white rounded-lg p-6 shadow mb-6">
    <h3 class="text-lg font-semibold mb-4">Financial Projections Chart</h3>
    <div class="relative">
      <canvas :id="chartId" width="800" height="400" class="w-full h-auto border border-gray-200 rounded"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  chartId: {
    type: String,
    default: 'chart'
  }
})

</script>