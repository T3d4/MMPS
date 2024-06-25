<template>
  <!-- Quiz View -->
  <div class="bg-slate-800 max-h-screen h-screen flex flex-col" v-if="quiz">
    <QuizHeader :quiz="quiz" :question-status="questionStatus" :bar-percentage="barPercentage" />

    <div class="flex-1 flex justify-center items-center">
      <div v-if="isLoading" class="flex items-center justify-center min-h-screen">Loading...</div>
      <div v-else-if="!showResults && !isLoading" class="w-[50%] flex items-center justify-center">
        <div class="grid grid-flow-col">
          <Question
            :question="quiz.questions[currentQuestionIndex]"
            :selected-option="selectedOptions[currentQuestionIndex]"
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
        :duration="quiz.duration"
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
import { ref, computed, reactive, watchEffect, onBeforeUnmount, onMounted } from 'vue'
import Question from '@/components/QuestionComponent.vue'
import QuizHeader from '@/components/QuizHeader.vue'
import Result from '@/components/ResultComponent.vue'
import QuestionSidebar from '@/components/QuestionSidebar.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { useRoute } from 'vue-router'
import { timeLeft, timeTaken, updateTimeLeft, updateTimeTaken } from '@/global_state/state'
import { useStore } from 'vuex'
import { axiosInstance } from '@/axiosConfig'

const quizes = ref([])
const route = useRoute()
const store = useStore()
const quizId = ref(Number(route.params.id))
const quiz = ref(null)
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const userAnswers = reactive({})
const answeredQuestions = reactive([])
const numberOfCorrectAnswers = ref(0)
let timerInterval = null
const showConfirmationModal = ref(false)
const isLoading = ref(true)
const originalDuration = ref(0)
const selectedOptions = reactive([])

const fetchQuizzes = async () => {
  try {
    const response = await axiosInstance.get(`/quiz`)
    quizes.value = response.data
    quiz.value = quizes.value.find((q) => q.id == quizId.value)
    if (quiz.value) {
      originalDuration.value = quiz.value.duration * 60

      // Check if there's stored timeLeft in localStorage
      const storedTimeLeft = localStorage.getItem('timeLeft')
      if (storedTimeLeft) {
        updateTimeLeft(parseInt(storedTimeLeft))
      } else {
        updateTimeLeft(quiz.value.duration * 60) // Set initial time
      }

      // Check if there's stored currentQuestionIndex in localStorage
      const storedCurrentQuestionIndex = localStorage.getItem('currentQuestionIndex')
      if (storedCurrentQuestionIndex) {
        currentQuestionIndex.value = parseInt(storedCurrentQuestionIndex)
      } else {
        currentQuestionIndex.value = 0 // Default to the first question
      }

      selectedOptions.splice(
        0,
        selectedOptions.length,
        ...Array(quiz.value.questions.length).fill(null)
      ) // Initialize selected options
    }
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    isLoading.value = false
  }
}

// Watch for changes in timeLeft and currentQuestionIndex
watchEffect(() => {
  localStorage.setItem('timeLeft', timeLeft.time.toString())
  localStorage.setItem('currentQuestionIndex', currentQuestionIndex.value.toString())
})

onMounted(() => {
  fetchQuizzes()

  // Restore timer state from localStorage
  const storedTimeLeft = localStorage.getItem('timeLeft')
  if (storedTimeLeft) {
    updateTimeLeft(parseInt(storedTimeLeft))
  }

  // Restore currentQuestionIndex from localStorage
  const storedCurrentQuestionIndex = localStorage.getItem('currentQuestionIndex')
  if (storedCurrentQuestionIndex) {
    currentQuestionIndex.value = parseInt(storedCurrentQuestionIndex)
  }

  // Start the timer
  if (!showResults.value) {
    startTimer()
  }
})

const questionStatus = computed(
  () => `${currentQuestionIndex.value + 1}/${quiz.value.questions.length}`
)

const barPercentage = computed(
  () => `${(answeredQuestions.length / quiz.value.questions.length) * 100}%`
)

const onOptionSelected = ({ optionId }) => {
  const currentQuestion = quiz.value.questions[currentQuestionIndex.value]

  // Check if the current question has already been answered
  if (!answeredQuestions.includes(currentQuestionIndex.value)) {
    // Add the current question index to answered questions
    answeredQuestions.push(currentQuestionIndex.value)

    // Find the selected option from the current question's options
    const selectedOption = currentQuestion.options.find((option) => option.id === optionId)

    // Determine if the selected option is correct
    const isCorrect = selectedOption.text === currentQuestion.correctAnswer

    // Update the userAnswers object with the selected option details
    userAnswers[currentQuestionIndex.value] = {
      question: currentQuestion.text,
      selectedOption: selectedOption.text,
      isCorrect: isCorrect
    }

    // Update the selectedOptions array with the selected option ID
    selectedOptions[currentQuestionIndex.value] = optionId

    // Update the number of correct answers if the selected option is correct
    if (isCorrect) {
      numberOfCorrectAnswers.value++
    }
  } else {
    // If the question has already been answered, allow changing the selection
    // Remove the previous answer from userAnswers and selectedOptions
    delete userAnswers[currentQuestionIndex.value]
    selectedOptions[currentQuestionIndex.value] = null

    // Proceed with selecting the new option
    const selectedOption = currentQuestion.options.find((option) => option.id === optionId)
    const isCorrect = selectedOption.text === currentQuestion.correctAnswer

    userAnswers[currentQuestionIndex.value] = {
      question: currentQuestion.text,
      selectedOption: selectedOption.text,
      isCorrect: isCorrect
    }

    selectedOptions[currentQuestionIndex.value] = optionId

    // Update the number of correct answers if the selected option is correct
    if (isCorrect) {
      numberOfCorrectAnswers.value++
    }
  }

  // Move to the next question if not the last question
  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const submitQuiz = async () => {
  showResults.value = true
  clearInterval(timerInterval)
  showConfirmationModal.value = false

  // Initialize variables to store results
  let correctAnswersCount = 0
  const totalQuestions = quiz.value.questions.length
  const answeredQuestions = Object.keys(userAnswers).length

  // Calculate the number of correct answers
  Object.values(userAnswers).forEach((answer) => {
    if (answer.isCorrect) {
      correctAnswersCount++
    }
  })

  // Display results to the user
  numberOfCorrectAnswers.value = correctAnswersCount

  // Optionally, you can also store these results in a backend or Vuex store
  const quizResult = {
    quizId: quiz.value._id,
    date: new Date().toISOString(),
    quizName: quiz.value.name,
    timeTaken: timeTaken.time / 60,
    totalQuestions: totalQuestions,
    answeredQuestions: answeredQuestions,
    correctAnswers: correctAnswersCount,
    userId: store.getters.user._id
  }

  try {
    const response = await axiosInstance.post('/quiz/quiz-result', quizResult)
    console.log(response)
  } catch (error) {
    console.error('Error submitting quiz result:', error)
  }
}

const navigateToQuestion = (index) => {
  currentQuestionIndex.value = index
}

const startTimer = () => {
  console.log('started')
  timerInterval = setInterval(() => {
    if (timeLeft.time > 0) {
      updateTimeLeft(timeLeft.time - 1)
      updateTimeTaken(timeTaken.time + 1)
    } else {
      clearInterval(timerInterval)
      showResults.value = true
    }
  }, 1000) // Update every second
}

onBeforeUnmount(() => {
  clearInterval(timerInterval)
})
</script>
