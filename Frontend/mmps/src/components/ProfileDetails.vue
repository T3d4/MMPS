<!-- src/components/ProfileDetails.vue -->
<template>
  <div class="gap-2">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Profile</h2>
    <div class="space-y-6">
      <div class="flex-row flex">
        <label class="sm:text-sm block w-1/4 text-gray-700 font-semibold mb-2 mr-2"
          >First Name <span class="text-red-600">*</span></label
        >
        <input
          disabled
          v-model="firstName"
          type="text"
          class="w-full p-2 border-4 rounded-lg border-gray-300 focus:outline-none ring-gray-300"
        />
      </div>
      <div class="flex-row flex">
        <label class="sm:text-sm block w-1/4 text-gray-700 font-semibold mb-2 mr-2"
          >Last Name <span class="text-red-600">*</span></label
        >
        <input
          disabled
          v-model="lastName"
          type="text"
          class="w-full p-2 border-4 rounded-lg border-gray-300 focus:outline-none ring-gray-300"
        />
      </div>

      <div class="flex-row flex">
        <label class="block w-1/4 text-gray-700 font-semibold mb-2 mr-2"
          >Email <span class="text-red-600">*</span></label
        >
        <input
          disabled
          v-model="email"
          type="text"
          class="w-full p-2 border-4 rounded-lg border-gray-300 focus:outline-none ring-gray-300"
        />
      </div>

      <div class="flex-row flex">
        <label class="block sm:text-sm w-1/4 text-gray-700 font-semibold mb-2 mr-2"
          >Phone No. <span class="text-red-600">*</span></label
        >
        <input
          v-model="phoneNumber"
          disabled
          type="text"
          class="w-full p-2 border-4 rounded-lg border-gray-300 focus:outline-none ring-gray-300"
        />
      </div>
    </div>
    <!-- <div class="w-full flex">
      <div class="w-3/4"></div>
      <button
        @click="saveProfile"
        class="disabled w-full opacity-50 bg-blue-500 text-white py-2 px-8 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save
      </button>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const firstName = ref(localStorage.getItem('firstName') || '')
const lastName = ref(localStorage.getItem('lastName') || '')
const email = ref(localStorage.getItem('email') || '')
const phoneNumber = ref(localStorage.getItem('phoneNumber') || '')
// const password = ref(localStorage.getItem('password') || '')

// const saveProfile = () => {
//   localStorage.setItem('firstName', firstName.value)
//   localStorage.setItem('lastName', lastName.value)
//   localStorage.setItem('email', email.value)
//   localStorage.setItem('phoneNumber', phoneNumber.value)
//   localStorage.setItem('password', password.value)
//   alert('Profile saved successfully!')
// }
</script>

<style scoped>
/* custom styles */
</style>
