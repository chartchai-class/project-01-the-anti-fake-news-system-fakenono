<script setup lang="ts">
import NewsCard from '@/components/NewsCard.vue'
import { useNewsListStore } from '@/stores/newslist'
import { NewsStatus, type News } from '@/types'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const store = useNewsListStore()
const { newslist } = storeToRefs(store)
const displayList = ref<News[]>(newslist.value || [])

function onFilterChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement
  const filterValue = selectElement.value

  if (filterValue === 'all') {
    displayList.value = newslist.value || []
  } else if (filterValue === 'verified') {
    displayList.value = newslist.value?.filter((news) => news.status === NewsStatus.Verified) || []
  } else if (filterValue === 'fake') {
    displayList.value = newslist.value?.filter((news) => news.status === NewsStatus.Fake) || []
  } else if (filterValue === 'pending') {
    displayList.value = newslist.value?.filter((news) => news.status === NewsStatus.Pending) || []
  }
}
</script>

<template>
  <div class="m-4 p-4 text-xl font-bold">
    <label for="news-filter" class="">Filter News: </label>
    <select
      name="news-filter"
      id="news-filter"
      class="text-white bg-black rounded-lg"
      @change="onFilterChange"
    >
      <option value="all" class="font-bold hover:bg-gray-300 hover:text-black">All</option>
      <option value="verified" class="font-bold hover:bg-gray-300 hover:text-black">
        Verified
      </option>
      <option value="fake" class="font-bold hover:bg-gray-300 hover:text-black">Fake</option>
      <option value="pending" class="font-bold hover:bg-gray-300 hover:text-black">Pending</option>
    </select>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 m-8">
    <NewsCard v-for="newsItem in displayList" :key="newsItem.id" :news="newsItem" />
  </div>
</template>
