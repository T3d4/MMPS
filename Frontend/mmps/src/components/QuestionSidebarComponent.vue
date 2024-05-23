<template>
  <div
    class="w-[250px] fixed top-25 bottom-5 right-4 rounded-md bg-gray-100 h-[80dvh] p-4 md:w-[150px] lg:w-[250px]"
  >
    <h2 class="text-xl font-semibold mb-4 text-gray-800">Questions</h2>
    <ul>
      <li
        v-for="(_, index) in props.questions"
        :key="index"
        :class="[
          'mb-2 p-2 rounded cursor-pointer bg-gray-300 text-gray-700 hover:bg-gray-200 ring-slate-500',
          { 'bg-blue-200': index === currentQuestionIndex }
        ]"
        @click="navigateToQuestion(index)"
      >
        Question {{ index + 1 }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  questions: Array,
  currentQuestionIndex: Number
})

const emit = defineEmits(['navigateToQuestion'])

const navigateToQuestion = (index) => {
  emit('navigateToQuestion', index)
}
</script>
