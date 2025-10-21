<template>
  <div class="bg-white rounded p-3 shadow">
    <div class="relative">
      <canvas :id="chartId" width="800" height="180" class="w-full h-auto border border-gray-200 rounded"></canvas>
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