<template>
  <!-- Admin Dashboard View -->
  <div
    class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh overflow-y-auto w-screen"
  >
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mb-8 mt-4">Admin Dashboard</h1>

      <div class="flex-grow w-full mt-8 px-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminCard
            v-for="section in adminSections"
            :key="section.id"
            :section="section"
            :sectionSelected="onSelectSection"
          />
        </div>
      </div>

      <AdminModal
        :show="showModal"
        :section="selectedSection"
        @actionConfirmed="handleActionConfirmed"
        @close="closeModal"
      />

      <p v-if="adminSections.length === 0" class="text-gray-600 mt-4">No sections available.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminCard from '@/components/AdminCard.vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminHeader from '@/components/AdminHeader.vue'
import adminSectionsData from '@/data/adminSections.json'
import { cancelLoading, view } from '@/global_state/state'

const adminSections = ref(adminSectionsData)
const showModal = ref(false)
const selectedSection = ref(null)
const router = useRouter()

onMounted(() => {
  view.value = 'admin'
})

const onSelectSection = (section) => {
  selectedSection.value = section
  showModal.value = true
  cancelLoading.value = false
}

const closeModal = () => {
  showModal.value = false
  cancelLoading.value = false
}

const handleActionConfirmed = () => {
  showModal.value = false
  cancelLoading.value = false
  router.push(`/admin/${selectedSection.value.id}`)
}
</script>
