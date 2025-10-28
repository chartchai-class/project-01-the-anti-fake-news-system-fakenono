<script setup lang="ts">
import { type News, NewsStatus } from '@/types'

const props = defineProps<{
  news: News
  isAdmin: boolean
}>()

const emit = defineEmits(['delete-news'])
function handleDelete() {
  emit('delete-news', props.news.id)
}
</script>

<template>
  <div
    class="flex flex-col p-4 m-2 w-[97%] md:w-[95%] rounded-lg shadow border-[2px]"
    :class="{
      'opacity-50 italic pointer-events-none': news.deleted,
    }"
  >
    <div class="flex width-full justify-between">
      <h3 class="text-gray-900 font-semibold flex gap-2 items-center">
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span v-if="!news.reporter.imageUrl" class="text-sm font-medium text-gray-600">{{
            news.reporter.username.substring(0, 2).toUpperCase()
          }}</span>
          <img
            v-else
            :src="news.reporter.imageUrl"
            alt="Reporter Avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
        </div>
        {{ news.reporter.username }}
      </h3>
      <div class="flex flex-row">
        <button
          v-if="isAdmin && !news.deleted"
          class="text-red-500 hover:text-red-700 text-sm font-medium"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </div>
    <RouterLink :to="`/news/${news.id}`" class="flex justify-center">
      <div class="flex flex-row hover:shadow-lg transition-shadow hover:scale-[1.01] w-full">
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
            <span v-if="news.deleted" class="text-red-600 font-normal text-sm"
              >This news has been deleted.</span
            >
          </h3>
          <p class="text-gray-600 break-all hidden md:block hyphens-auto">
            {{ news.details.slice(0, 130) }}...
          </p>
          <p class="text-sm text-gray-600 break-all block md:hidden hyphens-auto">
            {{ news.details.slice(0, 75) }}...
          </p>
          <p class="text-xs md:text-sm text-gray-500 mt-2">
            <span class="font-semibold">{{ news.reporter.username }}</span> |
            <span>{{ new Date(news.datetime).toLocaleDateString() }}</span>
          </p>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
