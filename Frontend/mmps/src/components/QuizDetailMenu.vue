<template>
  <div class="min-w-[200px] w-[500px] lg:w-1/3 mr-4 h-60 bg-gray-800 rounded-l-lg p-4">
    <ul>
      <li
        @click="setCurrentTab('details')"
        :class="{ 'active-link': currentTab === 'details' }"
        class="w-full text-left p-2 rounded nav-link cursor-pointer"
      >
        Quiz Details
      </li>
      <li
        @click="setCurrentTab('update')"
        :class="{ 'active-link': currentTab === 'update' }"
        class="w-full text-left p-2 rounded nav-link cursor-pointer"
      >
        Update Quiz
      </li>
      <li
        @click="setCurrentTab('delete')"
        :class="{ 'active-link': currentTab === 'delete' }"
        class="w-full text-left p-2 rounded nav-link cursor-pointer"
      >
        Delete Quiz
      </li>
    </ul>
  </div>
</template>

<script setup>
import { currentTabState } from '@/global_state/state'
import { ref } from 'vue'

const currentTab = ref('details')

const setCurrentTab = (tab) => {
  currentTab.value = tab
  currentTabState.value = currentTab.value
}
</script>

<style scoped>
.nav-link {
  position: relative;
  @apply text-gray-300 text-lg hover:text-white px-4 py-2 rounded-full transition-all duration-200;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0px;
  height: 4px;
  background-color: white;
  transition: width 0.3s ease-in-out;
}

/* .nav-link:hover::after {
  width: 70%;
} */

.active-link::after {
  width: 65%;
  background-color: white;
}
</style>
