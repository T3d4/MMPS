<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-2xl font-bold mb-4">Confirm Action</h3>
      <p class="mb-6 text-gray-700">Are you sure you want to manage the quiz: {{ quiz.title }}?</p>
      <div class="flex justify-end mt-6">
        <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2" @click="close">Cancel</button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" @click="confirmAction">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  quiz: Object
})
const emit = defineEmits(['actionConfirmed', 'close'])

const confirmAction = () => {
  emit('actionConfirmed')
}

const close = () => {
  emit('close')
}
</script>
