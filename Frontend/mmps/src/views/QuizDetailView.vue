<!-- src/views/QuizDetailView.vue -->
<template>
  <div
    class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">Quiz Details</h1>

      <div class="flex w-full mt-8 px-32 max-h-500px">
        <QuizDetailMenu />
        <QuizDetailContent />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/AdminHeader.vue'
import QuizDetailMenu from '@/components/QuizDetailMenu.vue'
import QuizDetailContent from '@/components/QuizDetailContent.vue'
import { view } from '@/global_state/state'
import { onMounted } from 'vue'

onMounted(() => (view.value = 'admin'))
</script>
