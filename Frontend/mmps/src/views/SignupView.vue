<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-green-900 overflow-y-auto"
  >
    <div class="bg-white bg-opacity-90 p-8 rounded shadow-md max-w-md w-full overflow-hidden">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center sm:text-xl">Create Account</h2>

      <form @submit.prevent="signupUser" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            v-model="signup.name"
            type="text"
            autocomplete="on"
            required
            class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="signup.email"
            type="email"
            autocomplete="on"
            required
            class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>

        <div class="relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="signup.password"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="on"
              required
              class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
            <button
              @click="togglePasswordVisibility"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400"
            >
              {{ passwordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="relative">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="signup.confirmPassword"
              type="password"
              autocomplete="on"
              required
              class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
            <button
              @click="toggleConfirmPasswordVisibility"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400"
            >
              {{ confirmPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="w-full">
          <button
            type="submit"
            class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
          >
            Sign Up
          </button>
        </div>
      </form>

      <div class="text-center mt-4 sm:mt-2">
        <span class="text-sm text-gray-600">Already have an account? </span>
        <router-link
          to="/login"
          class="font-medium text-indigo-600 hover:text-indigo-500"
          >Login</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import router from '../router'

const base = axios.create({
  baseURL: 'https://medboard.onrender.com/api/v1' // replace on production env
})

const signup = reactive({})
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false) // Added for confirm password

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value
}

const signupUser = () => {
  base
    .post('/signup', signup)
    .then((result) => {
      // Handle successful signup (e.g., redirect to login page)
      if (result.accesstkn) {
        router.push('/home')
      } else {
        router.push('/')
      }
    })
    .catch((err) => {
      console.log(err)
      // Handle signup errors
    })
}
</script>
