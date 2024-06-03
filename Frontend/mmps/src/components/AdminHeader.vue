<template>
  <header class="w-full bg-gray-900 p-4 flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-300">Admin Dashboard</h1>
    <nav>
      <ul class="flex space-x-4">
        <li><router-link to="/admin" class="text-gray-300 hover:text-white">Home</router-link></li>
        <li><router-link to="/admin/user-management" class="text-gray-300 hover:text-white">Users</router-link></li>
        <li><router-link to="/admin/quiz-management" class="text-gray-300 hover:text-white">Quizzes</router-link></li>
        <li><router-link to="/admin/statistics" class="text-gray-300 hover:text-white">Statistics</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
// import { router } from 'vue-router'
</script>
