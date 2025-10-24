<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/16/solid'
</script>

<template>
  <div class="w-[90%] flex flex-col justify-self-center">
    <RouterLink :to="{ name: 'home' }" class="flex flex-row justify-start mx-4 mt-4">
      <ArrowLeftIcon class="h-6 w-6 text-black mb-4 cursor-pointer" />
      Back
    </RouterLink>
    <div class="m-4 flex flex-row justify-around items-center">
      <RouterLink
        :to="{ name: 'admin-dashboard-view' }"
        class="text-xl font-bold p-2 rounded-md hover:text-white hover:bg-black"
        exact-active-class="bg-black text-white hover:bg-gray-900"
        >Dashboard</RouterLink
      >
      |
      <RouterLink
        :to="{ name: 'admin-member-requests-view' }"
        class="text-xl font-bold p-2 rounded-md hover:text-white hover:bg-black"
        exact-active-class="bg-black text-white hover:bg-gray-900"
        >Member Requests</RouterLink
      >
    </div>
    <hr class="border-t border-gray-300 my-4" />

    <RouterView />
  </div>
</template>
