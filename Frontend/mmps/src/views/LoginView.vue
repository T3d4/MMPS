<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-800 overflow-y-auto">
    <div class="bg-white bg-opacity-90 p-8 rounded shadow-md max-w-md w-full overflow-hidden">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">Account Login</h2>

      <form @submit.prevent="loginUser">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="login.email"
            type="email"
            autocomplete="on"
            required
            class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>

        <div class="mb-4 relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="login.password"
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

        <p v-if="error != null" class="text-red-500 my-2 text-sm pl-6">
          {{ error }}
        </p>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"
              >Forgot your password?</a
            >
          </div>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <span class="text-sm text-gray-600">Don't have an account? </span>
        <router-link to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500"
          >Sign Up</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import router from '../router'
import store from '@/store/store'

const login = reactive({ email: '', password: '' })
const passwordVisible = ref(false)
const error = ref(null)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const loginUser = async () => {
  try {
    error.value = null // Reset error message
    await store.dispatch('login', { email: login.email, password: login.password })
    if (store.getters.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (err) {
    console.error('Login failed:', err)
    error.value = 'Login failed. Please check your credentials and try again.'
  }
}
</script>
