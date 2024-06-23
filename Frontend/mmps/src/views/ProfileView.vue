<!-- src/views/ProfileView.vue -->
<template>
  <div
    class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <div class="w-full" v-if="isAdmin"><AdminHeader /></div>
    <div class="w-full" v-else><QuizzesHeader /></div>
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">Account Settings</h1>
      <div class="flex w-full mt-8 px-32 max-h-500px">
        <!-- Left Menu -->
        <ProfileMenu
          :initialOption="currentView"
          @optionSelected="handleOptionSelected"
          class="min-w-[200px] w-[500px] lg:w-1/3 mr-4 h-60 rounded-l-lg"
        />
        <!-- Right Form Section -->
        <div
          v-if="currentView === 'ForgotPassword'"
          class="min-w-[400px] w-[600px] lg:w-1/2 p-10 bg-white shadow-md rounded-r-lg"
        >
          <ForgotPassword />
        </div>
        <div v-else class="min-w-[400px] w-[600px] lg:w-1/2 p-10 bg-white shadow-md rounded-r-lg">
          <ProfileDetails />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import QuizzesHeader from '@/components/QuizzesHeader.vue'
import ProfileMenu from '@/components/ProfileMenu.vue'
import ProfileDetails from '@/components/ProfileDetails.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import AdminHeader from '@/components/AdminHeader.vue'
import { useStore } from 'vuex'


const store = useStore()
const isAdmin = computed(()=>store.getters.isAdmin)
const currentView = ref('ProfileDetails')

const handleOptionSelected = (option) => {
  if (option === 'profile') {
    currentView.value = 'ProfileDetails'
  } else if (option === 'forgot-password') {
    currentView.value = 'ForgotPassword'
  }
}
</script>

<style scoped>
/* custom styles */
</style>
