<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-2xl font-semibold mb-4 text-gray-700">Create New Quiz</h3>
      <form @submit.prevent="createQuiz">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title</label>
          <input
            v-model="title"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Quiz Title"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description</label>
          <textarea
            v-model="description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Quiz Description"
          ></textarea>
        </div>
        <div class="flex justify-end mt-6">
          <button
            type="button"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2"
            @click="close"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

defineProps({
  show: Boolean
})
const emit = defineEmits(['quizCreated', 'close'])

const title = ref('')
const description = ref('')

const createQuiz = () => {
  const newQuiz = {
    id: uuidv4(),
    title: title.value,
    description: description.value
  }
  emit('quizCreated', newQuiz)
  resetForm()
}

const close = () => {
  emit('close')
}

const resetForm = () => {
  title.value = ''
  description.value = ''
}
</script>
