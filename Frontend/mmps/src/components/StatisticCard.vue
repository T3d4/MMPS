<template>
  <div class="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
    <h2 class="text-xl font-bold text-white">{{ stat.title }}</h2>
    <p class="text-gray-400">{{ stat.value }}</p>
  </div>
</template>

<script setup>
defineProps({
  stat: Object
})
</script>
