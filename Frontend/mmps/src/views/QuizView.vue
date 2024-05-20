<template>
  <div class="bg-slate-800 max-h-screen h-screen flex flex-col" v-if="quiz">
    <!-- <div class="h-[20%] w-full"> -->
    <QuizHeader :quiz="quiz" :question-status="questionStatus" :bar-percentage="barPercentage" />

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
import { ref, computed, reactive, onMounted } from 'vue'
import Question from '@/components/QuestionComponent.vue'
import QuizHeader from '@/components/QuizHeaderComponent.vue'
import Result from '@/components/ResultComponent.vue'
import { useRoute } from 'vue-router'
import quizes from '@/data/quizes.json'
import { timeLeft, timeTaken } from '@/global_state/state'

const route = useRoute()
const quizId = parseInt(route.params.id)
const quiz = quizes.find((q) => q.id === quizId)
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const userAnswers = reactive([])
const numberOfCorrectAnswers = ref(0)

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
  }

  currentQuestionIndex.value++
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  userAnswers.splice(0, userAnswers.length)
  numberOfCorrectAnswers.value = 0
  showResults.value = false
}

onMounted(() => {
  const timerInterval = setInterval(() => {
    if (timeLeft.time > 0 && !showResults.value) {
      timeLeft.time--
      timeTaken.time++
    } else {
      clearInterval(timerInterval)
      showResults.value = true // Show results if time runs out
    }
  }, 1000) // Update every second
})
</script>
