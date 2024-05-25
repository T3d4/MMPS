<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Confirm Submission</h2>
      <p class="mb-6 text-gray-700">Are you sure you want to submit the quiz?</p>
      <div class="flex justify-end">
        <button
          @click="$emit('cancel')"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mr-2"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
})
</script>

<style scoped></style>
