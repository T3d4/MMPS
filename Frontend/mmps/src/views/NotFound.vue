<!-- src/views/NotFound.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Page Not Found</p>
      <router-link
        v-if="isAdmin"
        to="/admin"
        class="text-blue-500 hover:text-blue-700 font-semibold"
      >
        Go back to Home
      </router-link>
      <router-link v-else to="/" class="text-blue-500 hover:text-blue-700 font-semibold">
        Go back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { currentTabState } from '@/global_state/state'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isAdmin = computed(() => store.getters.isAdmin)
onMounted(() => (currentTabState.value = 'details'))
</script>

<style scoped>
/* custom styles here */
</style>
