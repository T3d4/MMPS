<!-- src/views/ProfileView.vue -->
<template>
  <div class="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Profile</h2>
    <div class="space-y-6">
      <div class="flex space-x-4">
        <div class="w-1/2">
          <label class="block text-gray-700 font-semibold mb-2">First Name:</label>
          <input
            v-model="firstName"
            type="text"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="w-1/2">
          <label class="block text-gray-700 font-semibold mb-2">Last Name:</label>
          <input
            v-model="lastName"
            type="text"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Email:</label>
        <input
          v-model="email"
          type="email"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Phone Number:</label>
        <input
          v-model="phoneNumber"
          type="tel"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Password:</label>
        <input
          v-model="password"
          type="password"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        @click="saveProfile"
        class="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
const phoneNumber = ref(localStorage.getItem('phoneNumber') || '')
const password = ref(localStorage.getItem('password') || '')

const saveProfile = () => {
  localStorage.setItem('firstName', firstName.value)
  localStorage.setItem('lastName', lastName.value)
  localStorage.setItem('email', email.value)
  localStorage.setItem('phoneNumber', phoneNumber.value)
  localStorage.setItem('password', password.value)
  alert('Profile saved successfully!')
}
</script>

<style scoped>
/* custom styles*/
</style>
