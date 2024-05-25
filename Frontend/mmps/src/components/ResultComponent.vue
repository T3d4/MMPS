<template>
  <!-- Result Component -->
  <div class="results w-full bg-white rounded shadow-md p-8 h-full">
    <div class="flex h-[60%] w-full justify-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 mt-4">Quiz Results</h1>
        <p class="text-lg text-gray-600 mb-4">Your Score:</p>
        <h2 class="text-4xl font-bold mb-6" :class="scoreColorClass">
          {{ numberOfCorrectAnswers }} / {{ quizQuestionLength }} ({{ scorePercentage }}%)
        </h2>
        <p class="text-lg text-gray-600 mb-4">Time Taken: {{ formatTimeTaken(timeTaken.time) }}</p>
        <div v-if="feedbackMessage" class="text-lg mb-4" :class="feedbackColorClass">
          {{ feedbackMessage }}
        </div>
      </div>
      <!-- <div class="w-1/2 overflow-y-auto h-[60dvh]">
        <table class="table-auto w-full mt-4" v-if="quizQuestions.length > 0">
          <thead class="sticky top-0 bg-slate-200">
            <tr>
              <th class="px-4 py-2 text-gray-600">Question</th>
              <th class="px-4 py-2 text-gray-600">Your Answer</th>
              <th class="px-4 py-2 text-gray-600">Correct Answer</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in quizQuestions" :key="index">
              <td class="border px-4 py-2 text-gray-600">{{ question.text }}</td>
              <td class="border px-4 py-2 text-gray-600">{{ yourAnswers[index] }}</td>
              <td class="border px-4 py-2 text-green-500">
                {{ yourAnswers[index] !== question.correctAnswer ? question.correctAnswer : ' ' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->
    </div>
    <div class="my-8 flex justify-center mr-4">
      <RouterLink
        @click="revertTimerState()"
        to="/quizes"
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-200 mr-4"
        >Go Back</RouterLink
      >
      <button
        @click="$emit('retakeQuiz')"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
      >
        Retake Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { timeLeft, timeTaken } from '@/global_state/state'
const props = defineProps({
  numberOfCorrectAnswers: Number,
  quizQuestionLength: Number,
  quizQuestions: Array,
  yourAnswers: Array
})
// Function to format time taken (e.g., in minutes and seconds)
function revertTimerState() {
  timeLeft.time = 120
  timeTaken.time = 0
}
// Function to format time taken
function formatTimeTaken(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}
const scorePercentage = computed(() =>
  Math.round((props.numberOfCorrectAnswers / props.quizQuestionLength) * 100)
)
const feedbackMessage = computed(() => {
  if (scorePercentage.value >= 80) return 'Excellent work!'
  if (scorePercentage.value >= 60) return 'Good job!'
  return 'You can do better, keep practicing!'
})
const feedbackColorClass = computed(() => {
  if (scorePercentage.value >= 80) return 'text-green-500'
  if (scorePercentage.value >= 60) return 'text-blue-500'
  return 'text-red-500'
})
const scoreColorClass = computed(() => {
  if (scorePercentage.value >= 80) return 'text-green-500'
  if (scorePercentage.value >= 60) return 'text-yellow-500'
  return 'text-red-500'
})
</script>
