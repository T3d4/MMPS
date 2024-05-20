<template>
  <div class="w-full bg-white shadow-md z-10 p-4">
    <div class="flex items-center justify-between">
      <h4 class="text-xl font-semibold text-gray-800">Question {{ questionStatus }}</h4>
      <div class="ml-28 p-2 bg-slate-200 rounded-md shadow" v-if="!showResults">
        <span class="text-lg text-gray-700">Time Left: {{ formatTimeTaken(timeLeft.time) }}</span>
      </div>
      <div class="bar w-64 h-6 bg-gray-200 rounded-full">
        <div
          class="completion h-full bg-slate-600 rounded-full"
          :style="{ width: barPercentage }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { timeLeft } from '@/global_state/state'

const { questionStatus, barPercentage, showResults } = defineProps([
  'questionStatus',
  'barPercentage',
  'showResults'
])

function formatTimeTaken(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}
</script>
