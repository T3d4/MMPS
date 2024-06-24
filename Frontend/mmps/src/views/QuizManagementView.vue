<template>
  <div
    class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full px-14">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">Quiz Management</h1>

      <!-- Search Input -->
      <div class="flex mb-4 justify-between space-x-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title"
          class="p-2 rounded bg-gray-700 text-gray-300 border border-gray-500"
        />

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
            v-for="quiz in filteredQuizzes"
            :key="quiz.id"
            :quiz="quiz"
            @quizSelected="onSelectQuiz"
          />
        </div>
      </div>

      <CreateQuizModal
        :show="showCreateModal"
        @quizCreated="handleQuizCreated"
        @close="closeCreateModal"
      />

      <p v-if="filteredQuizzes.length === 0" class="text-gray-600 mt-4">No quizzes available.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminHeader from '@/components/AdminHeader.vue'
import QuizCard from '@/components/QuizCard.vue'
import CreateQuizModal from '@/components/CreateQuizModal.vue'
import { axiosInstance } from '@/axiosConfig'

const router = useRouter()
const quizzes = ref([])
const showCreateModal = ref(false)
const searchQuery = ref('') // Add search query

const onSelectQuiz = (quiz) => {
  router.push({ name: 'QuizDetail', params: { id: quiz } })
}

const fetchQuizzes = async () => {
  const response = await axiosInstance.get('/quiz')
  quizzes.value = response.data
}

onMounted(fetchQuizzes)

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleQuizCreated = async (newQuiz) => {
  try {
    console.log(newQuiz)
    const response = await axiosInstance.post('/quiz', newQuiz)
    if (response.data) {
      // Assuming the API returns the created quiz
      quizzes.value.push(response.data)
      showCreateModal.value = false
    } else {
      console.error('Quiz creation response did not contain quiz data')
    }
  } catch (error) {
    console.error('Error creating quiz:', error)
    // Handle error (e.g., show error message to user)
  }
}

// Computed property for filtered quizzes
const filteredQuizzes = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return quizzes.value.filter(
    (quiz) => quiz.name && typeof quiz.name === 'string' && quiz.name.toLowerCase().includes(query)
  )
})
</script>
