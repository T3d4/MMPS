<template>
  <div class="grid gap-4 p-4 max-w-xs w-full">
    <button
      type="button"
      @click="handleClick"
      class="card w-full relative flex-1 shadow-inner shadow-slate-700 bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl p-4 flex flex-col items-start justify-between mr-8"
    >
      <div class="mb-">
        <h2 class="text-lg font-semibold text-gray-900">{{ quiz.name }}</h2>
        <p v-if="quiz.course" class="text-sm text-gray-700">Course: {{ quiz.course }}</p>
      </div>

      <div class="card-content">
        <p class="text-sm text-gray-600">{{ quiz.questions.length }} Questions</p>
        <div v-if="quiz.status" class="text-xs text-gray-500 mt-1">Status: {{ quiz.status }}</div>
      </div>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  quiz: Object
})

const emits = defineEmits(['quizSelected'])

const handleClick = () => {
  emits('quizSelected', props.quiz.id)
}
</script>

<style scoped>
.card {
  overflow: hidden;
  cursor: pointer;
}
</style>
