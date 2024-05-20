<template>
  <div class="bg-slate-800 max-h-screen h-screen flex flex-col" v-if="quiz">
    <QuizHeader
      :quiz="quiz"
      :question-status="questionStatus"
      :bar-percentage="barPercentage"
      :showResults="showResults"
    />

    <div class="flex-1 flex justify-center items-center">
      <div v-if="!showResults" class="w-[50%] flex items-center justify-center">
        <Question
          :question="quiz.questions[currentQuestionIndex]"
          @selectOption="onOptionSelected"
        />
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
</template>

<script setup>
import { ref, computed, reactive, watchEffect, onBeforeUnmount } from 'vue'
import Question from '@/components/QuestionComponent.vue'
import QuizHeader from '@/components/QuizHeaderComponent.vue'
import Result from '@/components/ResultComponent.vue'
import { useRoute } from 'vue-router'
import quizes from '@/data/quizes.json'
import { timeLeft, timeTaken } from '@/global_state/state'

const route = useRoute()
const quizId = ref(parseInt(route.params.id))
const quiz = quizes.find((q) => q.id === quizId.value)
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const userAnswers = reactive([])
const numberOfCorrectAnswers = ref(0)
let timerInterval = null

const questionStatus = computed(() => `${currentQuestionIndex.value}/${quiz.questions.length}`)
const barPercentage = computed(
  () => `${(currentQuestionIndex.value / quiz.questions.length) * 100}%`
)

const onOptionSelected = (isCorrect) => {
  userAnswers.push(
    quiz.questions[currentQuestionIndex.value].options.find(
      (option) => option.isCorrect === isCorrect
    ).text
  )
  if (isCorrect) {
    numberOfCorrectAnswers.value++
  }

  if (quiz.questions.length - 1 === currentQuestionIndex.value) {
    showResults.value = true
    clearInterval(timerInterval)
  }

  currentQuestionIndex.value++
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  userAnswers.splice(0, userAnswers.length)
  numberOfCorrectAnswers.value = 0
  showResults.value = false
  timeLeft.time = 120
  timeTaken.time = 0
}

// This lovely baby is who you call on to monitor reactive states
watchEffect(() => {
  console.log(quizId.value)
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

// Watch for face capture to start the quiz
// watch(faceCaptured, (newFaceCaptured) => {
//   if (newFaceCaptured) {
//     startQuiz();
//   }
// });
</script>
