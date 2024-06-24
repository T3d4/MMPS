<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl text-gray-600">
      <h2 class="text-2xl text-gray-800 font-bold mb-4">Create New Quiz</h2>
      <form @submit.prevent="createQuiz">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Quiz Title:</label>
          <input
            v-model="quiz.name"
            type="text"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Timer Duration (minutes):</label>
          <input
            v-model.number="quiz.duration"
            type="number"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Questions:</label>
          <div v-for="(question, qIndex) in quiz.questions" :key="qIndex" class="mb-6">
            <input
              v-model="question.text"
              type="text"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter question"
              required
            />
            <div
              v-for="(option, aIndex) in question.options"
              :key="aIndex"
              class="flex items-center mt-2"
            >
              <input
                v-model="option.text"
                type="text"
                class="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter answer"
                required
              />
              <input
                v-model="question.correctAnswer"
                :value="option.text"
                type="radio"
                class="ml-2"
                :name="'correctAnswer-' + qIndex"
                @change="setCorrectAnswer(qIndex, aIndex)"
                required
              />
            </div>
            <button
              type="button"
              @click="addAnswer(qIndex)"
              class="bg-green-500 text-white py-1 px-3 rounded mt-2 hover:bg-green-700"
            >
              Add Answer
            </button>
            <button
              type="button"
              @click="removeQuestion(qIndex)"
              class="bg-red-500 text-white py-1 px-3 rounded mt-2 ml-2 hover:bg-red-700"
            >
              Remove Question
            </button>
          </div>
          <button
            type="button"
            @click="addQuestion"
            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="close"
            class="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps(['show'])
const emit = defineEmits(['close', 'quizCreated'])

const quiz = ref({
  name: '',
  duration: 0,
  questions: []
})

const addQuestion = () => {
  quiz.value.questions.push({ text: '', options: [], correctAnswer: '' })
}

const addAnswer = (qIndex) => {
  const optionId = quiz.value.questions[qIndex].options.length + 1
  quiz.value.questions[qIndex].options.push({ id: optionId, text: '', isCorrect: false })
}

const removeQuestion = (qIndex) => {
  quiz.value.questions.splice(qIndex, 1)
}

const close = () => {
  emit('close')
}

const setCorrectAnswer = (qIndex, aIndex) => {
  quiz.value.questions[qIndex].options.forEach((option, index) => {
    option.isCorrect = index === aIndex
  })
}

const createQuiz = () => {
  // Validate each question to ensure a correct answer is selected
  const validQuiz = quiz.value.questions.every((question) => {
    const correctOptions = question.options.filter((option) => option.isCorrect)
    return correctOptions.length === 1 // Ensure exactly one correct option per question
  })

  if (!validQuiz) {
    // If validation fails, show an alert to select a correct answer
    alert('Please ensure each question has exactly one correct answer.')
    return // Exit function if validation fails
  }

  // Proceed with quiz creation if validation passes
  const questionsWithIds = quiz.value.questions.map((question, qIndex) => {
    return {
      id: qIndex + 1,
      text: question.text,
      options: question.options.map((option, oIndex) => ({
        id: oIndex + 1,
        label: String.fromCharCode(65 + oIndex), // A, B, C, D...
        text: option.text,
        isCorrect: option.isCorrect
      })),
      correctAnswer: question.options.find((option) => option.isCorrect)?.text || ''
    }
  })

  const newQuiz = {
    id: Math.floor(Math.random() * 10000), // Generate a random number for id
    name: quiz.value.name,
    dateCreated: new Date().toISOString(),
    questions: questionsWithIds,
    duration: quiz.value.duration
  }

  emit('quizCreated', newQuiz) // Emit event for quiz creation
  quiz.value.name = '' // Reset quiz name
  quiz.value.duration = 0 // Reset quiz duration
  quiz.value.questions = [] // Clear quiz questions
  close() // Close modal or form after quiz creation
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
