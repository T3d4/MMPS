<template>
  <div class="bg-slate-800 flex flex-col justify-start items-center pb-10 h-dvh w-screen overflow-y-auto">
    <AdminHeader />
    <div class="flex flex-col items-center h-full w-full">
      <h1 class="text-3xl font-bold text-gray-300 mt-4 mb-8">User Management</h1>

      <div class="flex-grow w-full mt-8 px-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UserCard
            v-for="user in users"
            :key="user.id"
            :user="user"
            :userSelected="onSelectUser"
          />
        </div>
      </div>

      <UserModal
        :show="showModal"
        :user="selectedUser"
        @actionConfirmed="handleActionConfirmed"
        @close="closeModal"
      />

      <p v-if="users.length === 0" class="text-gray-600 mt-4">
        No users available.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import UserCard from '@/components/UserCard.vue'
import UserModal from '@/components/UserModal.vue'
import userData from '@/data/users.json'
// import { modalState } from '@/global_state/state'

const users = ref(userData)
const showModal = ref(false)
const selectedUser = ref(null)
// const router = useRouter()

const onSelectUser = (user) => {
  selectedUser.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleActionConfirmed = () => {
  showModal.value = false
  // Perform actions based on user selection
}
</script>
