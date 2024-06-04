<template>
  <div class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen">
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full px-14">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">Quiz Management</h1>

      <div class="flex justify-end w-full mb-4">
        <button 
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" 
          @click="openCreateModal"
        >
          Create New Quiz
        </button>
      </div>

      <div class="flex-grow w-full mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuizCard
            v-for="quiz in quizzes"
            :key="quiz.id"
            :quiz="quiz"
            :quizSelected="onSelectQuiz"
          />
        </div>
      </div>

      <QuizModal
        :show="showModal"
        :quiz="selectedQuiz"
        @actionConfirmed="handleActionConfirmed"
        @close="closeModal"
      />

      <CreateQuizModal
        :show="showCreateModal"
        @quizCreated="handleQuizCreated"
        @close="closeCreateModal"
      />

      <p v-if="quizzes.length === 0" class="text-gray-600 mt-4">
        No quizzes available.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import QuizCard from '@/components/QuizCard.vue'
import QuizModal from '@/components/QuizModal.vue'
import CreateQuizModal from '@/components/CreateQuizModal.vue'
import quizData from '@/data/quizzes.json'
// import { modalState, loadingState } from '@/global_state/state'

const quizzes = ref(quizData)
const showModal = ref(false)
const showCreateModal = ref(false)
const selectedQuiz = ref(null)

const onSelectQuiz = (quiz) => {
  selectedQuiz.value = quiz
  showModal.value = true
//   modalState.value = true
//   loadingState.value = false
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeModal = () => {
  showModal.value = false
//   modalState.value = false
//   loadingState.value = false
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleActionConfirmed = () => {
  showModal.value = false
//   modalState.value = false
//   loadingState.value = false
  // Perform actions based on quiz selection
}

const handleQuizCreated = (newQuiz) => {
  quizzes.value.push(newQuiz)
  showCreateModal.value = false
}
</script>
