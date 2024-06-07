<template>
  <header class="w-full bg-gray-900 p-4 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-300">Admin Dashboard</h1>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <router-link
            to="/admin"
            class="nav-link"
            :class="{ 'active-link': $route.path === '/admin' }"
            @click.prevent="confirmNavigation('/admin')"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/user-management"
            class="nav-link"
            :class="{ 'active-link': $route.path === '/admin/user-management' }"
            @click.prevent="confirmNavigation('/admin/user-management')"
          >
            Users
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/quiz-management"
            class="nav-link"
            :class="{ 'active-link': $route.path === '/admin/quiz-management' }"
            @click.prevent="confirmNavigation('/admin/quiz-management')"
          >
            Quizzes
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/statistics"
            class="nav-link"
            :class="{ 'active-link': $route.path === '/admin/statistics' }"
            @click.prevent="confirmNavigation('/admin/statistics')"
          >
            Statistics
          </router-link>
        </li>
        <button
          @click="logout"
          class="text-red-600 hover:text-red-800 font-bold justify-center items-center flex"
        >
          Logout
        </button>
      </ul>
    </nav>

    <!-- Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Confirm Navigation</h2>
        <p class="mb-4">Are you sure you want to navigate to this section?</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelNavigation"
            class="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            @click="proceedNavigation"
            class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $route = useRoute()
const router = useRouter()

const showModal = ref(false)
const targetPath = ref('')

const confirmNavigation = (path) => {
  targetPath.value = path
  showModal.value = true
}

const cancelNavigation = () => {
  showModal.value = false
  targetPath.value = ''
}

const proceedNavigation = () => {
  showModal.value = false
  router.push(targetPath.value)
}

const logout = () => {
  // Clear user data from local storage or any other necessary cleanup
  localStorage.clear()
  router.push('/login')
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
  width: 0;
  height: 3px;
  background-color: white;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after {
  width: 100%;
}

.active-link::after {
  width: 100%;
  background-color: white;
}
</style>
