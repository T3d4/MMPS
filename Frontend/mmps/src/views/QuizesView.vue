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
      <Card v-for="quiz in filteredQuizes" :key="quiz.id" :quiz="quiz" />
    </div>
    <p v-if="filteredQuizes.length === 0" class="text-gray-600 mt-4">
      No quizzes found in this category.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from '../components/CardComponent.vue'
import quizData from '../data/quizes.json'

const quizes = ref(quizData)
const selectedCategory = ref('All') // New ref to track the selected category

// Computed property for filtering quizes based on category and search
const filteredQuizes = computed(() => {
  let filtered = quizes.value
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((quiz) => quiz.name === selectedCategory.value)
  }
  return filtered
})

// Get unique categories from quiz data
const categories = computed(() => {
  const uniqueCategories = new Set(quizes.value.map((quiz) => quiz.name))
  return ['All', ...uniqueCategories] // Add 'All' option
})
</script>

<style scoped>
header {
  margin-top: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

header h1 {
  font-weight: bold;
  margin-right: 30px;
}

header input {
  border: none;
  background-color: rgba(255, 255, 255, 0.737);
  border-radius: 5px;
  padding: 5px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
}

/* CARD */
</style>
