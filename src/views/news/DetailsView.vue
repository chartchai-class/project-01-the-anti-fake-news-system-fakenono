<script setup lang="ts">
import { useNewsStore } from '@/stores/news'
import { NewsStatus } from '@/types'
import { storeToRefs } from 'pinia'

interface News {
  id: number
  topic: string
  details: string
  reporter: string
  datetime: string
  image: string
  fakeVoteCount: number
  verifiedVoteCount: number
  comments: string[]
}

// const props = defineProps<{ id: string | number }>()
// const news = ref<News | null>(null)
// onMounted(async () => {
//   const newsId = Number(props.id)
//   if (!isNaN(newsId)) {
//     try {
//       const response = await NewsService.getNewsById(newsId)
//       news.value = response.data
//     } catch (error) {
//       console.error('Failed to fetch news:', error)
//     }
//   }
// })
const store = useNewsStore()
const { news } = storeToRefs(store)

function formatDate(datetime: string): string {
  const date = new Date(datetime)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div v-if="news" class="space-y-6 px-6 py-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-extrabold text-gray-900">{{ news.topic }}</h1>

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
    </div>

    <p class="text-gray-600">📝 {{ news.reporter }} — {{ formatDate(news.datetime) }}</p>

    <img
      :src="news.image"
      alt="News Image"
      class="rounded-xl w-full object-cover max-h-[400px] shadow-md"
    />

    <p class="text-lg leading-relaxed indent-8 text-justify text-gray-800">
      {{ news.details }}
    </p>

    <div class="flex justify-center mt-8">
      <div class="grid grid-cols-2 gap-6 w-full max-w-xl">
        <div class="bg-white rounded-xl p-6 text-center">
          <p class="text-gray-500 mb-2">Real Votes</p>
          <p class="text-2xl font-bold text-green-600">{{ news.verifiedVoteCount }}</p>
        </div>
        <div class="bg-white rounded-xl p-6 text-center">
          <p class="text-gray-500 mb-2">Fake Votes</p>
          <p class="text-2xl font-bold text-red-600">{{ news.fakeVoteCount }}</p>
        </div>
      </div>
    </div>
    <!-- <div class="grid grid-cols-3 gap-4 mt-6 text-center">
      <div>
        <p class="text-gray-500">Real Votes</p>
        <p class="text-xl font-semibold text-green-600">{{ news.verifiedVoteCount }}</p>
      </div>
      <div>
        <p class="text-gray-500">Fake Votes</p>
        <p class="text-xl font-semibold text-red-600">{{ news.fakeVoteCount }}</p>
      </div> -->
    <!-- <div>
        <p class="text-gray-500">Comments</p>
        <p class="text-xl font-semibold text-blue-600">{{ news.comments.length }}</p>
      </div> -->
    <!-- </div> -->

    <!-- <div class="mt-6">
      <h2 class="text-lg font-semibold mb-2">💬 View Comments ({{ news.comments.length }})</h2>
      <ul class="list-disc pl-5 space-y-1">
        <li v-for="(comment, index) in news.comments" :key="index">{{ comment }}</li>
      </ul>
    </div> -->
  </div>

  <div v-else class="text-center text-gray-500 py-10">Loading news...</div>
</template>
