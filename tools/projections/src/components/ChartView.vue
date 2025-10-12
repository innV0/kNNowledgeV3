<template>
  <div class="bg-white rounded-lg p-4 shadow mb-6">
    <div class="relative">
      <canvas :id="chartId" width="800" height="200" class="w-full h-auto border border-gray-200 rounded"></canvas>
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