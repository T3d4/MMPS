<template>
  <div class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh w-screen overflow-y-auto">
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mt-4 mb-8">Statistics</h1>

      <div class="flex-grow w-3/4 mt-8 px-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <StatisticCard
            v-for="stat in statistics"
            :key="stat.id"
            :stat="stat"
          />
        </div>
      </div>

      <p v-if="statistics.length === 0" class="text-gray-600 mt-4">
        No statistics available.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import StatisticCard from '@/components/StatisticCard.vue'
import { axiosInstance } from '@/axiosConfig'

const statistics = ref([])

const fetchStatistics = async () => {
  try {
    const [userResponse, quizResponse] = await Promise.all([
      axiosInstance.get("/users/total"),
      axiosInstance.get("/quiz/total")
    ])

    const userCount = userResponse.data.totalUsers
    const quizCount = quizResponse.data.totalQuizzes

    statistics.value = [
      { id: 1, title: 'Total Users', value: userCount },
      { id: 2, title: 'Total Quizzes', value: quizCount }
    ]
  } catch (error) {
    console.error("Failed to fetch statistics:", error)
  }
}

onMounted(fetchStatistics)
</script>
