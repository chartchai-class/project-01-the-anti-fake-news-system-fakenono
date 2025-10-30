<script setup lang="ts">
import NewsCard from '@/components/NewsCard.vue'
import NewsCardListForm from '@/components/NewsCardListForm.vue'
import NewsService from '@/services/NewsService'
import { useAuthStore } from '@/stores/auth'
import { type News } from '@/types'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

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

const newslist = ref<News[]>([])
const params = ref({})
const totalNewsCount = ref(0)
const totalPages = computed(() => {
  return Math.ceil((totalNewsCount.value ?? 0) / limit.value)
})
onMounted(() => {
  watchEffect(() => {
    NewsService.getNews(params.value).then(
      (response) => {
        newslist.value = response.data
        totalNewsCount.value = response.headers['x-total-count']
      },
      (error) => {
        console.error('Failed to fetch news:', error)
      },
    )
  })
})

function onFilterChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement
  const filterValue = selectElement.value
  if (filterValue === 'All' && params.value['status']) {
    delete params.value['status']
  } else {
    params.value['status'] = filterValue
  }
  page.value = 1 // Reset to first page when filter changes
}

function onLimitChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement
  page.value = 1 // Reset to first page when limit changes
  limit.value = parseInt(selectElement.value, 10)
}

watch([page, limit], ([newPage, newLimit]) => {
  if (
    isNaN(newPage) ||
    isNaN(newLimit) ||
    newPage < 1 ||
    newLimit < 1 ||
    newPage > totalPages.value
  ) {
    router.replace({
      name: 'not-found-view',
      query: { resource: 'page' },
      params: { catchAll: 'pagenotfound' },
    })
    params.value['page'] = newPage
    params.value['limit'] = newLimit
    newslist.value = []
    return
  }
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

    page.value = newPage
    limit.value = newLimit
    params.value['page'] = newPage
    params.value['limit'] = newLimit
    newslist.value = []
  },
  { immediate: true },
)

const view = ref('grid')
function toggleView() {
  view.value = view.value === 'grid' ? 'list' : 'grid'
}

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
const toast = useToast()

function handleDeleteNews(deletedNewsId: number) {
  NewsService.deleteNews(deletedNewsId).then(
    () => {
      NewsService.getNews(params.value).then(
        (response) => {
          newslist.value = response.data
          totalNewsCount.value = response.headers['x-total-count']
        },
        (error) => {
          console.error('Failed to fetch news:', error)
        },
      )
      toast.success('News deleted successfully.')
    },
    (error) => {
      console.error('Failed to delete news:', error)
      toast.error('Failed to delete news.')
    },
  )
}

const keyword = ref('')
watch(keyword, (newKeyword) => {
  if (newKeyword.trim().length < 3) {
    delete params.value['search']
  } else {
    params.value['search'] = newKeyword
  }
})
</script>

<template>
  <div class="flex justify-between">
    <input
      type="text"
      id="post-topic"
      class="text-xs md:text-base border border-black p-2 rounded-lg w-full bg-black m-2 text-white font-semibold placeholder:font-semibold placeholder:text-gray-200"
      placeholder="Search..."
      v-model="keyword"
    />
    <RouterLink
      :to="{ name: 'news-post-view' }"
      class="bg-black text-white p-2 px-3 rounded-lg m-2 font-bold text-xl flex flex-row justify-self-end"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Post
    </RouterLink>
  </div>
  <div class="flex flex-row justify-between items-center">
    <div class="m-4 px-4 py-2 text-lg md:text-xl font-semibold">
      <label for="news-filter">Filter News: </label>
      <select
        name="news-filter"
        id="news-filter"
        class="text-white bg-black rounded-lg"
        @change="onFilterChange"
      >
        <option value="All" class="font-semibold hover:bg-gray-300 hover:text-black">All</option>
        <option value="Verified" class="font-semibold hover:bg-gray-300 hover:text-black">
          Verified
        </option>
        <option value="Fake" class="font-semibold hover:bg-gray-300 hover:text-black">Fake</option>
        <option value="Pending" class="font-semibold hover:bg-gray-300 hover:text-black">
          Pending
        </option>
      </select>
    </div>

    <div
      @click="toggleView"
      class="border-black font-normal border-2 rounded-lg p-1 m-2 flex items-center justify-center w-18 h-10 bg-white shadow-md"
    >
      <div
        :class="[
          'flex-1 flex items-center justify-center p-1 cursor-pointer rounded-md',
          view === 'grid' ? 'bg-black text-white' : 'text-black',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M3 15h18" />
          <path d="M9 3v18" />
          <path d="M15 3v18" />
        </svg>
      </div>

      <div
        :class="[
          'flex-1 flex items-center justify-center p-1 cursor-pointer rounded-md',
          view === 'list' ? 'bg-black text-white' : 'text-black',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
    </div>
  </div>

  <div v-if="view === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 m-8">
    <NewsCard
      v-for="newsItem in newslist"
      :key="newsItem.id"
      :news="newsItem"
      :is-admin="isAdmin"
      @delete-news="handleDeleteNews"
    />
  </div>

  <div v-else class="flex flex-col justify-center m-2 md:m-8 gap-2">
    <NewsCardListForm
      v-for="newsItem in newslist"
      :key="newsItem.id"
      :news="newsItem"
      :is-admin="isAdmin"
      @delete-news="handleDeleteNews"
    />
  </div>

  <div class="flex md:flex-row flex-col items-center justify-start m-6 ml-14 font-semibold">
    <div class="text-sm md:text-base m-3">
      <label for="page-limit">Show </label>
      <select
        id="page-limit"
        class="ml-2 bg-black text-white py-2 rounded-lg"
        @change="onLimitChange"
      >
        <option value="6">6</option>
        <option value="12">12</option>
        <option value="18">18</option>
      </select>
      <label for="page-limit"> News Per Page</label>
    </div>
    <div class="flex items-center m-3 md:ml-[14rem]">
      <RouterLink
        class="text-xs md:text-basetext-decoration-none bg-black px-4 py-2 rounded-lg hover:bg-gray-600 text-white"
        :to="{ query: { page: page - 1, limit: limit } }"
        v-if="page > 1"
        rel="prev"
        >Previous</RouterLink
      >
      <span class="text-xs md:text-base mx-2">Page {{ page }} of {{ totalPages }}</span>
      <RouterLink
        class="text-xs md:text-base text-decoration-none bg-black px-4 py-2 rounded-lg hover:bg-gray-600 text-white"
        :to="{ query: { page: parseInt(page as string) + 1, limit: limit } }"
        v-if="page < totalPages"
        rel="next"
        >Next</RouterLink
      >
    </div>
  </div>
</template>
