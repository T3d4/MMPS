<template>
  <div
    class="min-w-[400px] w-[600px] lg:w-1/2 p-10 bg-white shadow-md rounded-r-lg max-h-[60dvh] overflow-y-auto"
  >
    <div v-if="currentTabState.value === 'details'">
      <h2 class="text-3xl font-bold mb-4 text-gray-800">{{ quiz.name }}</h2>
      <p class="text-gray-600">Created at: {{ formatDate(quiz.dateCreated) }}</p>
      <p class="text-gray-600">Duration: {{ quiz.duration }} minutes</p>
      <h3 class="text-xl text-gray-700 font-bold mb-2 mt-4">Questions</h3>
      <ul class="mb-4">
        <li v-for="(question, qIndex) in quiz.questions" :key="qIndex" class="mb-4">
          <p class="text-gray-700">{{ qIndex + 1 }}. {{ question.text }}</p>
          <ul>
            <li v-for="(option, oIndex) in question.options" :key="oIndex" class="text-gray-600">
              <span :class="{ 'font-bold text-green-600': option.text === question.correctAnswer }">
                {{ String.fromCharCode(97 + oIndex) }}. {{ option.text }}
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
          <label class="block text-gray-700 font-semibold mb-2">Name:</label>
          <input
            v-model="quiz.name"
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
              v-for="(option, oIndex) in question.options"
              :key="oIndex"
              class="flex items-center mt-2"
            >
              <input
                v-model="option.text"
                type="text"
                class="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter option"
                required
              />
              <input
                v-model="question.correctAnswer"
                :value="option.text"
                type="radio"
                class="ml-2"
                :name="'correctAnswer-' + qIndex"
                required
              />
            </div>
            <button
              type="button"
              @click="addOption(qIndex)"
              class="bg-green-500 text-white py-1 px-3 rounded mt-2 hover:bg-green-700"
            >
              Add Option
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/date'
import { currentTabState } from '@/global_state/state'
import { axiosInstance } from '@/axiosConfig'
import { useStore } from 'vuex'

const store = useStore()
const userId = computed(() => store.getters.user._id)
const uid = userId.value

const route = useRoute()
const router = useRouter()
const quizId = ref(route.params.id)
const quiz = ref({
  id: '',
  name: '',
  dateCreated: '',
  duration: 0,
  questions: []
})

// Fetch quiz data based on quizId
const fetchQuizData = async (id) => {
  try {
    const response = await axiosInstance.get(`/quiz/${id}`, { params: { uid } })
    const { _id, ...rest } = response.data.quiz
    quiz.value = { id: _id, ...rest }
  } catch (error) {
    console.error('Error fetching quiz data:', error)
  }
}

const addQuestion = () => {
  quiz.value.questions.push({ text: '', options: [], correctAnswer: null })
}

const addOption = (questionIndex) => {
  quiz.value.questions[questionIndex].options.push({ text: '', isCorrect: false })
}

const removeQuestion = (questionIndex) => {
  quiz.value.questions.splice(questionIndex, 1)
}

const validateOptions = (question) => {
  return (
    question.options.length > 1 &&
    question.correctAnswer !== null &&
    question.options.some((option) => option.text === question.correctAnswer)
  )
}

const updateQuiz = async () => {
  try {
    if (quiz.value.questions.every(validateOptions)) {
      const updatedQuiz = {
        id: quiz.value.id,
        name: quiz.value.name,
        dateCreated: quiz.value.dateCreated,
        questions: quiz.value.questions.map((question) => ({
          id: question.id,
          text: question.text,
          correctAnswer: question.correctAnswer,
          options: question.options.map((option) => ({
            id: option.id,
            label: option.label,
            text: option.text
          }))
        }))
      }

      // Log the request payload for debugging
      console.log('Updating quiz with payload:', updatedQuiz)

      // Make the API request to update the quiz
      const response = await axiosInstance.patch(`/quiz/${quizId.value}`, updatedQuiz)

      console.log('Quiz updated:', response.data)
      alert('Quiz updated successfully')
    } else {
      console.error('Some questions have invalid options')
      alert('Some questions have invalid options')
    }
  } catch (error) {
    console.error('Error updating quiz:', error.response ? error.response.data : error.message)
    alert(
      'Failed to update quiz: ' + (error.response ? error.response.data.message : error.message)
    )
  }
}

const deleteQuiz = async () => {
  try {
    const response = await axiosInstance.delete(`/quiz/${quizId.value}`)
    console.log('Quiz deleted:', response.data)
    alert('Quiz deleted successfully')
    router.push('/quizzes')
  } catch (error) {
    console.error('Error deleting quiz:', error)
    alert('Failed to delete quiz')
  }
}
console.log(quizId.value)
onMounted(() => {
  fetchQuizData(quizId.value)
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
