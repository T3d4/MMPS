<template>
  <!-- Quiz View -->
  <div class="bg-slate-800 max-h-screen h-screen flex flex-col" v-if="quiz">
    <QuizHeader :quiz="quiz" :question-status="questionStatus" :bar-percentage="barPercentage" />

    <div class="flex-1 flex justify-center items-center">
      <div v-if="!showResults" class="w-[50%] flex items-center justify-center">
        <div class="grid grid-flow-col">
          <Question
            :question="quiz.questions[currentQuestionIndex]"
            @selectOption="onOptionSelected"
          />
          <!-- Sidebar for navigating questions -->
          <QuestionSidebar
            :questions="quiz.questions"
            :current-question-index="currentQuestionIndex"
            :answered-questions="answeredQuestions"
            @navigateToQuestion="navigateToQuestion"
            @submit="showConfirmationModal = true"
          />
        </div>
      </div>
      <Result
        v-else
        :numberOfCorrectAnswers="numberOfCorrectAnswers"
        :quizQuestionLength="quiz.questions.length"
        :quizQuestions="quiz.questions"
        :yourAnswers="userAnswers"
        @retakeQuiz="restartQuiz"
      />
    </div>
  </div>
  <div v-else class="flex items-center justify-center min-h-screen">Quiz not found.</div>
  <ConfirmationModal
    v-if="showConfirmationModal"
    @confirm="submitQuiz"
    @cancel="showConfirmationModal = false"
  />
</template>

<script setup>
import { ref, computed, reactive, watchEffect, onBeforeUnmount } from 'vue'
import Question from '@/components/QuestionComponent.vue'
import QuizHeader from '@/components/QuizHeader.vue'
import Result from '@/components/ResultComponent.vue'
import QuestionSidebar from '@/components/QuestionSidebar.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { useRoute } from 'vue-router'
import quizes from '@/data/quizzes.json'
import { timeLeft, timeTaken } from '@/global_state/state'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const quizId = ref(parseInt(route.params.id))
const quiz = quizes.find((q) => q.id === quizId.value)
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const userAnswers = reactive([])
const answeredQuestions = reactive([])
const numberOfCorrectAnswers = ref(0)
let timerInterval = null
const showConfirmationModal = ref(false)



const questionStatus = computed(() => `${currentQuestionIndex.value + 1}/${quiz.questions.length}`)
const barPercentage = computed(() => `${(answeredQuestions.length / quiz.questions.length) * 100}%`)

const onOptionSelected = (isCorrect) => {
  userAnswers.push(
    quiz.questions[currentQuestionIndex.value].options.find(
      (option) => option.isCorrect === isCorrect
    ).text
  )
  if (isCorrect) {
    numberOfCorrectAnswers.value++
  }

  if (!answeredQuestions.includes(currentQuestionIndex.value)) {
    answeredQuestions.push(currentQuestionIndex.value)
  }

  if (quiz.questions.length - 1 === currentQuestionIndex.value) {
    currentQuestionIndex.value -= 1
  }

  currentQuestionIndex.value++
}

const submitQuiz = async () => {
  showResults.value = true
  clearInterval(timerInterval)
  showConfirmationModal.value = false

  // Collect quiz result data
  const quizResult = {
    date: new Date().toISOString(),
    quizName: quiz.name,
    timeTaken: timeTaken.time,
    totalQuestions: quiz.questions.length,
    answeredQuestions: answeredQuestions.length,
    correctAnswers: numberOfCorrectAnswers.value,
    userId: store.getters.user._id
  }

  try {
    const response = await this.$axios.post('/quiz/quiz-result', quizResult)
    console.log(response)
    // Optionally, store locally or in Vuex for immediate access
    // store.commit('addQuizResult', quizResult)
  } catch (error) {
    console.error('Error submitting quiz result:', error)
  }
}

const navigateToQuestion = (index) => {
  currentQuestionIndex.value = index
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  userAnswers.splice(0, userAnswers.length)
  numberOfCorrectAnswers.value = 0
  answeredQuestions.length = 0
  showResults.value = false
  timeLeft.time = 120
  timeTaken.time = 0
}

// This lovely baby is who you call on to monitor reactive states
watchEffect(() => {
  if (quizId.value > 0 && !showResults.value) {
    // Start the timer
    timerInterval = setInterval(() => {
      if (timeLeft.time > 0) {
        timeLeft.time--
        timeTaken.time++
      } else {
        clearInterval(timerInterval)
        showResults.value = true
      }
    }, 1000) // Update every second
  } else {
    // Stop the timer
    clearInterval(timerInterval)
  }
})
onBeforeUnmount(() => {
  clearInterval(timerInterval)
})
</script>
