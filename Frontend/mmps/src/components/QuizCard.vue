<!-- src/components/QuizCard.vue -->
<template>
  <div
    @click="selectQuiz"
    class="bg-gray-700 text-gray-300 p-4 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-200"
  >
    <h3 class="text-lg font-bold mb-2">{{ quiz.name }}</h3>
    <p class="text-sm">Created at: {{ formatDate(quiz.dateCreated) }}</p>
  </div>
</template>

<script setup>
const props = defineProps({ quiz: Object })
const emit = defineEmits(['quizSelected'])

console.log(props.quiz)

const selectQuiz = () => {
  emit('quizSelected', props.quiz.id)
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>
