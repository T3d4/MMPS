<template>
  <div class="w-full bg-white shadow-md z-10 p-4">
    <div class="flex items-center justify-between">
      <h4 class="text-xl font-semibold text-gray-800">Question {{ questionStatus }}</h4>
      <div class="timer">
        <span class="text-lg text-gray-600">Time Left: {{ formatTimeTaken(displayTimeLeft) }}</span>
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
import { ref, onMounted, watch } from 'vue'
import { timeLeft } from '@/global_state/state'

defineProps(['questionStatus', 'barPercentage'])

const displayTimeLeft = ref(timeLeft.time)

onMounted(() => {
  const storedTimeLeft = localStorage.getItem('timeLeft')
  if (storedTimeLeft) {
    displayTimeLeft.value = parseInt(storedTimeLeft)
  }
})

watch(
  () => timeLeft.time,
  (newValue) => {
    displayTimeLeft.value = newValue
    localStorage.setItem('timeLeft', newValue.toString())
  }
)

function formatTimeTaken(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m : ${remainingSeconds.toString().padStart(2, '0')}s`
}
</script>

<style scoped>
.timer {
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
