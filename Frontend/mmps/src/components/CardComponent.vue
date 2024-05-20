<template>
  <router-link :to="`/quiz/${quiz.id}`" class="block">
    <div
      class="w-72 overflow-hidden mb-9 cursor-pointer relative shadow-inner shadow-slate-700 bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl mx-2 p-4 flex flex-col items-start justify-between"
    >
      <div class="mb-2">
        <h2 class="text-lg font-semibold text-gray-900">{{ quiz.name }}</h2>
        <p v-if="quiz.course" class="text-sm text-gray-700">Course: {{ quiz.course }}</p>
      </div>

      <div class="card-content">
        <p class="text-sm text-gray-600">{{ quiz.questions.length }} Questions</p>
        <div v-if="quiz.status" class="text-xs text-gray-500 mt-1">Status: {{ quiz.status }}</div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  quiz: Object
})
</script>
