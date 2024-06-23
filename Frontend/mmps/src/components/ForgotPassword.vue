<!-- src/components/ForgotPassword.vue -->
<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Forgot Password</h2>
    <div class="space-y-6">
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Email:</label>
        <input
          v-model="email"
          type="email"
          class="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        @click="sendResetLink"
        class="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send Reset Link
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex';

const store = useStore()
const email = computed(()=>store.getters.user.email)

const sendResetLink = () => {
  // Simulate sending a reset link
  alert(`Reset link sent to ${email.value}`)
}
</script>

<style scoped>
/* custom styles */
</style>
