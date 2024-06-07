<template>
  <!-- Quizzes View -->
  <div class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto">
    <QuizzesHeader />
    <div class="flex flex-col items-center h-full">
      <h1 class="text-3xl font-bold text-gray-300 my-8">Select a Quiz</h1>

      <div class="flex-grow w-full mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Card
            v-for="quiz in filteredQuizes"
            :key="quiz.id"
            :quiz="quiz"
            @quizSelected="onSelectQuiz"
          />
        </div>
      </div>
      <FacialRecognitionModal
        :show="showModal"
        mode="quiz"
        :quizId="quizId"
        @verified="handleFaceVerified"
        @close="closeModal"
      />
      <p v-if="filteredQuizes.length === 0" class="text-gray-600 mt-4">
        No quizzes found in this category.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import Card from '@/components/QuizCard.vue'
import quizData from '@/data/quizzes.json'
import FacialRecognitionModal from '@/components/FacialRecoginitionModal.vue'
import QuizzesHeader from '@/components/QuizzesHeader.vue'
import { capturing, showCamera, cancelLoading, view } from '@/global_state/state'

const quizes = ref(quizData)
const selectedCategory = ref('All') // New ref to track the selected category
const showModal = ref(false)
const route = useRoute()
const quizId = route.params.quizId
// const quizId = ref(null)

onMounted(() => {
  view.value = 'user'
})

// Computed property for filtering quizes based on category and search
const filteredQuizes = computed(() => {
  let filtered = quizes.value
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((quiz) => quiz.name === selectedCategory.value)
  }
  return filtered
})

// TODO
const onSelectQuiz = () => {
  showModal.value = true
  showCamera.state = true
  cancelLoading.value = false
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
  router.push(`/quiz/${quizId}`)
}
</script>
