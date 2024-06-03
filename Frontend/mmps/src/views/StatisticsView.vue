<template>
  <div class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh w-screen overflow-y-auto">
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mt-4 mb-8">Statistics</h1>

      <div class="flex-grow w-full mt-8 px-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
import { ref } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import StatisticCard from '@/components/StatisticCard.vue'
import statisticsData from '@/data/statistics.json'

const statistics = ref(statisticsData)
</script>
