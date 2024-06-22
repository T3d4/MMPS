<!-- src/components/UserCard.vue -->
<template>
  <div
    class="bg-gray-700 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-600 transition-all"
    @click="goToDetail"
  >
    <h2 class="text-xl font-bold text-white">{{ user.name }}</h2>
    <p class="text-gray-400">{{ user.role }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  user: Object
})

const router = useRouter()

const goToDetail = () => {
  router.push({ name: 'UserDetail', params: { id: props.user._id } })
}
</script>
