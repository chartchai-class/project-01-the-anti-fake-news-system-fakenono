<script setup lang="ts">
import NewsCard from '@/components/NewsCard.vue'
import { useNewsListStore } from '@/stores/newslist'
import { storeToRefs } from 'pinia'

const store = useNewsListStore()
const { newslist } = storeToRefs(store)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 m-8">
    <NewsCard v-for="newsItem in newslist" :key="newsItem.id" :news="newsItem" />
  </div>
</template>
