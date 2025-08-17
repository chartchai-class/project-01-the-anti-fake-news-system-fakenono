<script setup lang="ts">
import { type News, NewsStatus } from '@/types'

defineProps<{
  news: News
}>()
</script>

<template>
  <RouterLink :to="`/news/${news.id}`">
    <div
      class="border-[2px] p-4 m-2 w-[90%] h-[28rem] rounded-lg shadow hover:shadow-lg transition-shadow hover:scale-[1.01]"
    >
      <h3 class="text-xl font-bold mb-2 h-14">
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
      <img :src="news.image" alt="News Image" class="w-full h-48 object-cover rounded-lg mb-4" />
      <p class="text-gray-600">{{ news.details.slice(0, 150) }}...</p>
      <p class="text-sm text-gray-500 mt-2">
        <span class="font-semibold">{{ news.reporter }}</span> |
        <span>{{ new Date(news.datetime).toLocaleDateString() }}</span>
      </p>
    </div>
  </RouterLink>
</template>
