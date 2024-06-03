<template>
  <div
    class="bg-gray-700 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-600 transition-all"
    @click="selectUser"
  >
    <h2 class="text-xl font-bold text-white">{{ user.name }}</h2>
    <p class="text-gray-400">{{ user.role }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  user: Object,
  userSelected: Function
})

const selectUser = () => {
  props.userSelected(props.user)
}
</script>
