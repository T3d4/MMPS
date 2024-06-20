<template>
  <div
    class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">User Details</h1>

      <div class="flex w-full mt-8 px-32 max-h-500px">
        <!-- Left Menu or Navigation -->
        <div class="min-w-[200px] w-[500px] lg:w-1/3 mr-4 h-60 bg-gray-700 rounded-l-lg p-4">
          <ul>
            <li
              class="text-gray-300 text-lg hover:text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
              :class="{ 'bg-gray-600': currentTab === 'details' }"
              @click="currentTab = 'details'"
            >
              User Details
            </li>
            <li
              class="text-gray-300 text-lg hover:text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
              :class="{ 'bg-gray-600': currentTab === 'update' }"
              @click="currentTab = 'update'"
            >
              Update User
            </li>
            <li
              class="text-gray-300 text-lg hover:text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
              :class="{ 'bg-gray-600': currentTab === 'delete' }"
              @click="currentTab = 'delete'"
            >
              Delete User
            </li>
          </ul>
        </div>

        <!-- Right Content Section -->
        <div class="min-w-[400px] w-[600px] lg:w-1/2 p-10 bg-white shadow-md rounded-r-lg">
          <div v-if="currentTab === 'details'">
            <h2 class="text-2xl font-bold mb-4">{{ user.name }}</h2>
            <p class="text-gray-600">{{ user.role }}</p>
            <h3 class="text-xl font-bold mb-2">Scores of Previous Quizzes</h3>
            <ul class="mb-4">
              <li v-for="(quiz, index) in user.quizzes" :key="index" class="text-gray-600">
                {{ quiz.name }}: {{ quiz.score }}
              </li>
            </ul>
            <h3 class="text-xl font-bold mb-2">Likes</h3>
            <ul class="mb-4">
              <li v-for="(like, index) in user.likes" :key="index" class="text-gray-600">
                {{ like }}
              </li>
            </ul>
          </div>

          <div v-else-if="currentTab === 'update'">
            <h2 class="text-2xl font-bold mb-4">Update User</h2>
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
                <label class="block text-gray-700 font-semibold mb-2">Role:</label>
                <input
                  v-model="user.role"
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
            <h2 class="text-2xl font-bold mb-4">Delete User</h2>
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
import { ref } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = ref(route.params.id)

const currentTab = ref('details')

// Dummy user data (replace with actual data fetching logic)
const user = ref({
  id: userId.value,
  name: 'John Doe',
  role: 'Admin',
  quizzes: [
    { name: 'Quiz 1', score: 80 },
    { name: 'Quiz 2', score: 75 }
  ],
  likes: ['Programming', 'Reading']
})

const updateUser = () => {
  // Implement logic to update user details
  console.log('Update user:', user.value.id)
}

const deleteUser = () => {
  // Implement logic to delete user
  console.log('Delete user:', user.value.id)
}
</script>

<style scoped>
/* Custom styles specific to this component */
</style>
