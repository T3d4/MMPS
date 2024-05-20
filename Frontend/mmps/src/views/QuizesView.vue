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
const selectedCategory = ref('All')

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
