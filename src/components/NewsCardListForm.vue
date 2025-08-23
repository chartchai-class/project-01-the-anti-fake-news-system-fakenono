<script setup lang="ts">
import { type News, NewsStatus } from '@/types'

defineProps<{
  news: News
}>()
</script>

<template>
  <RouterLink :to="`/news/${news.id}`" class="flex justify-center">
    <div
      class="border-[2px] flex flex-row p-4 m-2 w-[97%] md:w-[95%] rounded-lg shadow hover:shadow-lg transition-shadow hover:scale-[1.01]"
    >
      <div class="w-[30%] h-[10rem] p-2">
        <img
          :src="news.image"
          alt="News Image"
          class="w-full h-full object-cover rounded-lg mb-4"
        />
      </div>

      <div class="p-2 w-[80%]">
        <h3 class="text-lg md:text-xl font-bold mb-2">
          {{ news.topic }}
          <span
            v-if="news.status === NewsStatus.Verified"
            class="bg-green-600 text-white text-sm border p-1 rounded-xl"
            >Verified</span
          >
          <span
            v-else-if="news.status === NewsStatus.Fake"
            class="bg-red-600 text-white text-sm border p-1 rounded-xl"
            >Fake</span
          >
          <span v-else class="bg-gray-600 text-white text-sm border p-1 rounded-xl">Pending</span>
        </h3>
        <p class="text-gray-600 break-all hidden md:block hyphens-auto">
          {{ news.details.slice(0, 150) }}...
        </p>
        <p class="text-sm text-gray-600 break-all block md:hidden hyphens-auto">
          {{ news.details.slice(0, 75) }}...
        </p>
        <p class="text-xs md:text-sm text-gray-500 mt-2">
          <span class="font-semibold">{{ news.reporter }}</span> |
          <span>{{ new Date(news.datetime).toLocaleDateString() }}</span>
        </p>
      </div>
    </div>
  </RouterLink>
</template>
