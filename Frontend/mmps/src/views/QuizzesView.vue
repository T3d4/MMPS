<template>
  <!-- Quizzes View -->
  <div class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto">
    <QuizzesHeader />
    <div class="flex flex-col items-center h-full">
      <h1 class="text-3xl font-bold text-gray-300 my-8">Select a Quiz</h1>

      <div class="flex-grow w-full mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Card v-for="quiz in quizData" :key="quiz.id" :quiz="quiz" @quizSelected="onSelectQuiz" />
        </div>
      </div>
      <FacialRecognitionModal
        :show="showModal"
        mode="quiz"
        :quizId="quizId"
        @verified="handleFaceVerified"
        @close="closeModal"
      />
      <p v-if="quizData.length === 0" class="text-gray-600 mt-4">
        No quizzes found in this category.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import Card from '@/components/QuizCard.vue'
import quizData from '@/data/quizzes.json'
import FacialRecognitionModal from '@/components/FacialRecoginitionModal.vue'
import QuizzesHeader from '@/components/QuizzesHeader.vue'
import { capturing, showCamera, cancelLoading, view } from '@/global_state/state'

const showModal = ref(false)
const quizId = ref(null)

console.log(quizId)
// const quizId = ref(null)

onMounted(() => {
  view.value = 'user'
})

// Computed property for filtering quizes based on category and search
// const filteredQuizes = computed(() => {
//   let filtered = quizes.value
//   if (selectedCategory.value !== 'All') {
//     filtered = filtered.filter((quiz) => quiz.name === selectedCategory.value)
//   }
//   return filtered
// })

// TODO
const onSelectQuiz = (quiz) => {
  console.log('Quiz selected:', quiz)
  showModal.value = true
  showCamera.state = true
  cancelLoading.value = false
  quizId.value = quiz.toString()
}

const closeModal = () => {
  showModal.value = false
  capturing.state = false
  showCamera.state = false
}

// Function to handle the "verified" event from the modal
const handleFaceVerified = () => {
  showModal.value = false
  capturing.state = false
  showCamera.state = false
  router.push(`/quiz/${quizId.value}`)
}
</script>
