<template>
  <div class="w-full bg-white shadow-md z-10 p-2 flex items-center justify-between">
    <h4 class="text-xl font-semibold text-gray-800">Welcome, {{ user.name.split(" ")[0] }}</h4>
    <div class="flex items-center space-x-4">
      <router-link to="/" class="nav-link" :class="{ 'active-link': $route.path === '/' }"
        >Home</router-link
      >
      <router-link
        to="/profile"
        class="nav-link"
        :class="{ 'active-link': $route.path === '/profile' }"
        >Profile</router-link
      >
      <button @click="logout" class="text-red-600 hover:text-red-800 font-bold pr-4">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.getters.user)

const router = useRouter()
const $route = useRoute()

const logout = () => {
  // Clear user data from local storage or any other necessary cleanup
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  position: relative;
  @apply text-gray-600 font-bold text-lg hover:text-gray-900 px-4 py-2 transition-all duration-200;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px; /* Adjusted to place the underline slightly below */
  width: 0;
  height: 3px; /* Thicker underline */
  background-color: black; /* Dark underline for visibility */
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after {
  width: 100%;
}

.active-link::after {
  width: 100%;
  background-color: black; /* Ensure active link has the same color underline */
}
</style>
