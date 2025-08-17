<script setup lang="ts">
import NewsCard from '@/components/NewsCard.vue'
import { useNewsListStore } from '@/stores/newslist'
import { NewsStatus, type News } from '@/types'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useNewsListStore()
const { newslist } = storeToRefs(store)

const filterList = ref<News[]>(newslist.value || [])

function onFilterChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement
  const filterValue = selectElement.value
  if (filterValue === 'all') {
    filterList.value = newslist.value || []
  } else if (filterValue === 'verified') {
    filterList.value = newslist.value?.filter((news) => news.status === NewsStatus.Verified) || []
  } else if (filterValue === 'fake') {
    filterList.value = newslist.value?.filter((news) => news.status === NewsStatus.Fake) || []
  } else if (filterValue === 'pending') {
    filterList.value = newslist.value?.filter((news) => news.status === NewsStatus.Pending) || []
  }
}

const route = useRoute()
const router = useRouter()
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 6,
  },
})

const page = ref(props.page)
const limit = ref(props.limit)
const totalPages = computed(() => Math.ceil((filterList.value?.length || 0) / limit.value))
const displayList = ref(
  filterList.value.slice((page.value - 1) * limit.value, page.value * limit.value),
)

watch([page, limit], ([newPage, newLimit]) => {
  router.push({
    name: 'home',
    query: {
      page: newPage,
      limit: newLimit,
    },
  })
})

watch(
  () => route.query,
  (newQuery) => {
    const newPage = parseInt(newQuery.page as string) || 1
    const newLimit = parseInt(newQuery.limit as string) || 6
    console.log('Query changed:', newQuery)
    page.value = newPage
    limit.value = newLimit
    displayList.value = filterList.value.slice(
      (page.value - 1) * limit.value,
      page.value * limit.value,
    )
  },
)
</script>

<template>
  <div class="m-4 p-4 text-xl font-semibold">
    <label for="news-filter">Filter News: </label>
    <select
      name="news-filter"
      id="news-filter"
      class="text-white bg-black rounded-lg"
      @change="onFilterChange"
    >
      <option value="all" class="font-semibold hover:bg-gray-300 hover:text-black">All</option>
      <option value="verified" class="font-semibold hover:bg-gray-300 hover:text-black">
        Verified
      </option>
      <option value="fake" class="font-semibold hover:bg-gray-300 hover:text-black">Fake</option>
      <option value="pending" class="font-semibold hover:bg-gray-300 hover:text-black">
        Pending
      </option>
    </select>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 m-8">
    <NewsCard v-for="newsItem in displayList" :key="newsItem.id" :news="newsItem" />
  </div>

  <div class="flex flex-row items-center justify-between m-6 ml-14 mr-[40%] font-semibold">
    <div>
      <label for="page-limit">Show </label>
      <select id="page-limit" class="ml-2 bg-black text-white py-2 rounded-lg" v-model="limit">
        <option value="6">6</option>
        <option value="12">12</option>
        <option value="24">24</option>
      </select>
      <label for="page-limit"> News Per Page</label>
    </div>
    <div class="flex items-center">
      <RouterLink
        class="text-decoration-none bg-black px-4 py-2 rounded-lg hover:bg-gray-600 text-white"
        :to="{ query: { page: page - 1, limit: limit } }"
        v-if="page > 1"
        rel="prev"
        >Previous</RouterLink
      >
      <span class="mx-2">Page {{ page }} of {{ totalPages }}</span>
      <RouterLink
        class="text-decoration-none bg-black px-4 py-2 rounded-lg hover:bg-gray-600 text-white"
        :to="{ query: { page: parseInt(page as string) + 1, limit: limit } }"
        v-if="page < totalPages"
        rel="next"
        >Next</RouterLink
      >
    </div>
  </div>
</template>
