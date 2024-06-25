<!-- src/views/UserDetailView.vue -->
<template>
  <div
    class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">User Details</h1>

      <button
        @click="goBack"
        class="self-start bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ml-32"
      >
        Back
      </button>

      <div class="flex w-full mt-8 px-32 max-h-500px">
        <!-- Left Menu or Navigation -->
        <div class="min-w-[200px] w-[500px] lg:w-1/3 mr-4 h-60 bg-gray-800 rounded-l-lg p-4">
          <h2 class="text-2xl text-white my-2 mx-2 font-bold mb-4">User Details</h2>
          <ul>
            <li
              @click="currentTab = 'details'"
              :class="{ 'active-link': currentTab === 'details' }"
              class="w-full text-left p-2 rounded nav-link cursor-pointer"
            >
              User Details
            </li>
            <li
              @click="currentTab = 'update'"
              :class="{ 'active-link': currentTab === 'update' }"
              class="w-full text-left p-2 rounded nav-link cursor-pointer"
            >
              Update User
            </li>
            <li
              @click="currentTab = 'delete'"
              :class="{ 'active-link': currentTab === 'delete' }"
              class="w-full text-left p-2 rounded nav-link cursor-pointer"
            >
              Delete User
            </li>
          </ul>
        </div>

        <!-- Right Content Section -->
        <div
          class="min-w-fit w-[600px] max-h-[60dvh] lg:w-1/2 p-4 bg-white shadow-md rounded-r-lg overflow-y-auto"
        >
          <div v-if="currentTab === 'details'" class="text-white p-5 h-full w-full">
            <h2 class="text-2xl text-gray-800 font-bold mb-3">{{ user.name }}</h2>
            <h3 class="text-xl mb-4 text-gray-600">Scores of Previous Quizzes</h3>
            <div class="overflow-x-auto">
              <table class="w-full mb-4 bg-gray-800 rounded-lg overflow-y-auto">
                <thead class="bg-gray-300">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                    >
                      Quiz Name
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                    >
                      Score
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                    >
                      Obtainable Score
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-300">
                  <tr v-for="quiz in user.quizzes" :key="quiz.date" class="hover:bg-gray-400 bg-gray-300">
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800">{{ quiz.quizName }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800">{{ quiz.correctAnswers }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800">{{ quiz.totalQuestions }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800">{{ formatDate(quiz.date) }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-800">{{ formatTime(quiz.date) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else-if="currentTab === 'update'" class="text-gray-600">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Update User</h2>
            <form @submit.prevent="updateUser">
              <div class="mb-4">
                <label class="block text-gray-700 font-semibold mb-2">Name:</label>
                <input
                  v-model="user.name"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 font-semibold mb-2">Email:</label>
                <input
                  v-model="user.email"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>

          <div v-else-if="currentTab === 'delete'">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Delete User</h2>
            <p class="text-gray-600 mb-4">Are you sure you want to delete this user?</p>
            <button
              @click="deleteUser"
              class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import { useRoute } from 'vue-router'
import { currentTabState, view } from '@/global_state/state'
import { axiosInstance } from '@/axiosConfig' // Adjust the path as needed
import router from '@/router'

const route = useRoute()
const userId = ref(route.params.id)
const currentTab = ref('details')

const user = ref({
  id: '',
  name: '',
  email: '',
  quizzes: []
})

const goBack = () => {
  router.go(-1)
  currentTabState.value = "details"
}

// Fetch user data based on userId
const fetchUserData = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`)
    const { _id, ...rest } = response.data
    user.value = { id: _id, ...rest }
    console.log(user.value.id)
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const fetchUserQuizData = async (id) => {
  const response = await axiosInstance.get(`/quiz/user/${id}`)
  user.value.quizzes = response.data
}

onMounted(() => {
  fetchUserData(userId.value)
  fetchUserQuizData(userId.value)
  view.value = 'admin'
})

const updateUser = async () => {
  try {
    console.log(user.value)
    await axiosInstance.patch(`/users/${user.value.id}`, {
      ...user.value,
      id: undefined,
      _id: undefined,
      quizzes: undefined,
      name: user.value.name,
      email: user.value.email,
      isAdmin: undefined
    })
    console.log('User updated successfully')
    alert('User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const deleteUser = async () => {
  try {
    console.log(user.value.id)
    await axiosInstance.delete(`/users/${user.value.id}`)
    console.log('User deleted successfully')
    alert('User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

// Function to format date and time
const formatDate = (dateString) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleTimeString('en-UK', options)
}
</script>

<style scoped>
.nav-link {
  position: relative;
  @apply text-gray-300 text-lg hover:text-white px-4 py-2 rounded-full transition-all duration-200;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0px;
  height: 4px;
  background-color: white;
  transition: width 0.3s ease-in-out;
}

.active-link::after {
  width: 65%;
  background-color: white;
}
</style>
