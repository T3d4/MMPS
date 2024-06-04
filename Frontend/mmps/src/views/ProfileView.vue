<!-- src/views/ProfileView.vue -->
<template>
  <div class="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
    <h2 class="text-3xl font-bold mb-6">Profile</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-gray-700 font-semibold mb-2">First Name:</label>
        <input
          v-model="firstName"
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Last Name:</label>
        <input
          v-model="lastName"
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Email:</label>
        <input
          v-model="email"
          type="email"
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        @click="saveProfile"
        class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const firstName = ref(localStorage.getItem('firstName') || '')
const lastName = ref(localStorage.getItem('lastName') || '')
const email = ref(localStorage.getItem('email') || '')

const saveProfile = () => {
  localStorage.setItem('firstName', firstName.value)
  localStorage.setItem('lastName', lastName.value)
  localStorage.setItem('email', email.value)
  alert('Profile saved successfully!')
}
</script>

<style scoped>
/* custom styles here if necessary */
</style>