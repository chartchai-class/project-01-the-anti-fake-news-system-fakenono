<script setup lang="ts">
import NewsCard from '@/components/NewsCard.vue'
import NewsService from '@/services/NewsService'
import { NewsStatus, type News } from '@/types'
import { onMounted, ref } from 'vue'

const newsList = ref<News[]>([])

// Fetch news data from the service
onMounted(() => {
  NewsService.getNews().then((response) => {
    newsList.value = response.data
    for (const news of newsList.value) {
      const totalVoteCount = news.fakeVoteCount + news.verifiedVoteCount
      if (totalVoteCount < 20) {
        news.status = NewsStatus.Pending
      } else if (news.verifiedVoteCount / totalVoteCount < 0.6) {
        news.status = NewsStatus.Fake
      } else {
        news.status = NewsStatus.Verified
      }
    }
  })
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 m-8">
    <NewsCard v-for="newsItem in newsList" :key="newsItem.id" :news="newsItem" />
  </div>
</template>
