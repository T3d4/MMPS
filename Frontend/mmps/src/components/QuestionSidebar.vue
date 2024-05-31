<template>
  <div
    class="w-[250px] fixed top-25 bottom-5 right-4 rounded-md bg-gray-100 h-[80dvh] p-4 md:w-[150px] lg:w-[250px]"
  >
    <div class="relative h-full">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Questions</h2>
      <div class="h-[80%] overflow-y-auto">
        <ul>
          <li
            v-for="(_, index) in props.questions"
            :key="index"
            :class="[
              'mb-2 p-2 rounded cursor-pointer bg-gray-300 text-gray-700 hover:bg-gray-200 ring-slate-500',
              {
                'bg-blue-200': index === currentQuestionIndex,
                'bg-green-200': answeredQuestions.includes(index)
              }
            ]"
            @click="navigateToQuestion(index)"
          >
            Question {{ index + 1 }}
          </li>
        </ul>
      </div>
      <div class="h-[10%] absolute bottom-0 w-full">
        <button
          @click="$emit('submit')"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  questions: Array,
  currentQuestionIndex: Number,
  answeredQuestions: Array
})

const emit = defineEmits(['navigateToQuestion', 'submit'])

const navigateToQuestion = (index) => {
  emit('navigateToQuestion', index)
}
</script>
