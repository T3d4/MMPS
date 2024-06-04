<!-- src/views/NotFound.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Page Not Found</p>
      <router-link
        to="/"
        class="text-blue-500 hover:text-blue-700 font-semibold"
      >
        Go back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* custom styles here if necessary */
</style>
