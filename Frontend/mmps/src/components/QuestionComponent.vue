<template>
  <!-- Question Component -->
  <div
    class="question-container mx-auto rounded-md shadow-md bg-white p-6 mb-4 w-full max-w-md sm:max-w-lg h-full"
  >
    <h1 class="question text-2xl font-semibold text-gray-800 mb-4">
      {{ question.text }}
    </h1>

    <div>
      <button
        v-for="option in question.options"
        :key="option.id"
        class="flex items-center py-3 px-4 w-full text-left bg-gray-100 hover:bg-gray-200 rounded mb-2"
        :class="{
          correct: selectedOption === option.id && option.isCorrect,
          incorrect: selectedOption === option.id && !option.isCorrect
        }"
        @click="selectOption(option.id, option.isCorrect)"
      >
        <span
          class="mr-4 px-4 py-2 text-lg font-medium text-gray-700 ring-slate-500 ring-2 rounded"
          >{{ option.label }}</span
        >
        <span class="option-value text-gray-900">{{ option.text }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['selectOption'])

const { question } = defineProps({
  question: Array,

})

const selectedOption = ref(null)

const selectOption = (id, isCorrect) => {
  selectedOption.value = id
  emit('selectOption', isCorrect)
}
</script>
