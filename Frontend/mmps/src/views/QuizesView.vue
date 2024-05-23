<template>
  <div class="bg-slate-800 min-h-screen flex flex-col items-center py-10">
    <h1 class="text-3xl font-bold text-gray-300 mb-8">Select a Quiz</h1>

    <div class="flex space-x-4 mb-8">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="{
          'bg-blue-500 text-white': selectedCategory === category,
          'bg-gray-200 text-gray-700': selectedCategory !== category
        }"
        class="px-4 py-2 rounded-md transition duration-200"
      >
        {{ category }}
      </button>
    </div>

    <div class="flex flex-wrap mt-8">
      <Card v-for="quiz in filteredQuizes" :key="quiz.id" :quiz="quiz" @quizSelected="onSelectQuiz"/>
    </div>
    <FacialRecognitionModal :show="showModal" @close="onClose" @verified="onFaceVerified"/>
    <p v-if="filteredQuizes.length === 0" class="text-gray-600 mt-4">
      No quizzes found in this category.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import { verified } from '@/global_state/state';
import router from '@/router'
import Card from '@/components/CardComponent.vue'
import quizData from '@/data/quizes.json'
import FacialRecognitionModal from '@/components/FacialRecoginitionModal.vue'

const quizes = ref(quizData)
const selectedCategory = ref('All') // New ref to track the selected category
const showModal = ref(false)
// const quizId = ref(null)


// Computed property for filtering quizes based on category and search
const filteredQuizes = computed(() => {
  let filtered = quizes.value
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((quiz) => quiz.name === selectedCategory.value)
  }
  return filtered
})

const onSelectQuiz = () => {
  showModal.value = true
}

const onClose = () =>{
  showModal.value = false
}

// Get unique categories from quiz data
const categories = computed(() => {
  const uniqueCategories = new Set(quizes.value.map((quiz) => quiz.name))
  return ['All', ...uniqueCategories] // Add 'All' option
})

// Function to handle the "verified" event from the modal
const onFaceVerified = (quizId) => {
  router.push({ name: 'Quiz', params: { id: quizId } });
};
</script>
