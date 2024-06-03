<template>
  <div
    class="bg-gray-700 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-600 transition-all"
    @click="selectSection"
  >
    <div :class="`icon-${section.icon} text-5xl mb-4`"></div>
    <h2 class="text-xl font-bold text-white">{{ section.title }}</h2>
    <p class="text-gray-400">{{ section.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  section: Object,
  sectionSelected: Function
})

const selectSection = () => {
  props.sectionSelected(props.section)
}
</script>
