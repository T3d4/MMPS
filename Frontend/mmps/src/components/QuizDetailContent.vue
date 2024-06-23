<template>
  <div
    class="min-w-[400px] w-[600px] lg:w-1/2 p-10 bg-white shadow-md rounded-r-lg max-h-[68dvh] overflow-y-auto"
  >
    <div v-if="currentTabState.value === 'details'">
      <h2 class="text-3xl font-bold mb-4 text-gray-800">{{ quiz.title }}</h2>
      <p class="text-gray-600">Created at: {{ formatDate(quiz.dateCreated) }}</p>
      <p class="text-gray-600">Duration: {{ quiz.duration }} minutes</p>
      <h3 class="text-xl text-gray-700 font-bold mb-2 mt-4">Questions</h3>
      <ul class="mb-4">
        <li v-for="(question, qIndex) in quiz.questions" :key="qIndex" class="mb-4">
          <p class="text-gray-700">{{ qIndex + 1 }}. {{ question.text }}</p>
          <ul>
            <li v-for="(answer, aIndex) in question.answers" :key="aIndex" class="text-gray-600">
              <span
                :class="{
                  'font-bold text-green-600': aIndex === question.correctAnswerIndex
                }"
              >
                {{ aIndex + 1 }}. {{ answer.text }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div v-else-if="currentTabState.value === 'update'" class="text-gray-600">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">Update Quiz</h2>
      <form @submit.prevent="updateQuiz">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Title:</label>
          <input
            v-model="quiz.title"
            type="text"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Duration (minutes):</label>
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
              v-for="(answer, aIndex) in question.answers"
              :key="aIndex"
              class="flex items-center mt-2"
            >
              <input
                v-model="answer.text"
                type="text"
                class="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter answer"
                required
              />
              <input
                v-model="question.correctAnswerIndex"
                :value="aIndex"
                type="radio"
                class="ml-2"
                :name="'correctAnswer-' + qIndex"
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
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Update
          </button>
        </div>
      </form>
    </div>

    <div v-else-if="currentTabState.value === 'delete'">
      <h2 class="text-2xl font-bold mb-4 text-red-600">Delete Quiz</h2>
      <p class="text-gray-600 mb-4">Are you sure you want to delete this quiz?</p>
      <div class="flex justify-end space-x-2">
        <button
          @click="deleteQuiz"
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils/date'
import { currentTabState } from '@/global_state/state'

const route = useRoute()
const quizId = ref(route.params.id)
const quiz = ref({
  id: '',
  title: '',
  dateCreated: '',
  duration: 0,
  questions: []
})

const addQuestion = () => {
  quiz.value.questions.push({ text: '', answers: [], correctAnswerIndex: null })
}

const addAnswer = (questionIndex) => {
  quiz.value.questions[questionIndex].answers.push({ text: '' })
}

const removeQuestion = (questionIndex) => {
  quiz.value.questions.splice(questionIndex, 1)
}

const validateAnswers = (question) => {
  return (
    question.answers.length > 1 &&
    question.correctAnswerIndex !== null &&
    question.correctAnswerIndex >= 0 &&
    question.correctAnswerIndex < question.answers.length
  )
}

const updateQuiz = () => {
  if (quiz.value.questions.every(validateAnswers)) {
    console.log('Quiz updated:', quiz.value)
    // Replace with actual update logic, e.g., API call
  } else {
    console.error('Some questions have invalid answers')
  }
}

const deleteQuiz = () => {
  console.log('Quiz deleted:', quiz.value.id)
  // Replace with actual delete logic, e.g., API call
}

onMounted(() => {
  // Fetch quiz data by ID (replace with actual data fetching logic)
  // Dummy data example:
  quiz.value = {
    id: quizId.value,
    title: 'Sample Quiz',
    dateCreated: '2023-01-01T00:00:00Z',
    duration: 30,
    questions: [
      {
        text: 'What is 2+2?',
        answers: [{ text: '3' }, { text: '4' }, { text: '5' }],
        correctAnswerIndex: 1
      },
      {
        text: 'What is the capital of France?',
        answers: [{ text: 'Berlin' }, { text: 'Madrid' }, { text: 'Paris' }],
        correctAnswerIndex: 2
      }
    ]
  }
})
</script>

<style scoped>
.active-link {
  background-color: #3b82f6;
  color: white;
}

.nav-link:hover {
  cursor: pointer;
  background-color: #4b5563;
  color: white;
}
</style>
