<template>
  <div class="w-full bg-white shadow-md z-10 p-4 flex items-center justify-between">
    <h4 class="text-xl font-semibold text-gray-800">Welcome, {{ userFirstName }}</h4>
    <div class="flex items-center space-x-4">
      <router-link to="/" class="text-gray-600 hover:text-gray-900">Home</router-link>
      <router-link to="/profile" class="text-gray-600 hover:text-gray-900">Profile</router-link>
      <button @click="logout" class="text-red-600 hover:text-red-800">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userFirstName = ref(localStorage.getItem('firstName') || 'User')

const router = useRouter()

const logout = () => {
  // Clear user data from local storage or any other necessary cleanup
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
/* Add your custom styles here */
</style>
