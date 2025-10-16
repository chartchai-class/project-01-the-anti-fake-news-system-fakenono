<script setup lang="ts">
import CommentService from '@/services/CommentService'
import { useNewsStore } from '@/stores/news'
import { useUserStore } from '@/stores/user'
import { computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const tempId = parseInt(useRoute().params.id.toString())
const router = useRouter()
const totalCommentCount = computed(() => {
  return useNewStore.news?.comments.length
})
const useNewStore = useNewsStore()
const userStore = useUserStore()

onMounted(() => {
  // Need to change , when news part is finished
  // news.value = newslist.value.find((item) => item.id === tempId) || null
  // newsStore.setNews(news.value)
  userStore.reloadUserFromStorages()
  console.log('User', userStore.user)
  watchEffect(() => {
    console.log('News ID:', tempId)
    CommentService.getNewsById(tempId)
      .then((response) => {
        useNewStore.setNews(response.data)
        // setStatus(useNewStore.news)
        console.log(useNewStore.news)
      })
      .catch((err) => {
        console.log(err)
        router.push({ name: '404-resource-view', params: { resource: 'News' } })
      })
  })
  // CommentService.getCommentsByNewsId(tempId, 6, 1).then((comments) => {
  //   totalCommentCount.value = comments.headers['x-total-count']
  // })
})

// function setStatus(news: News): void {
//   if (news.status == "Pending")
//     news.status = NewsStatus.Pending
//   else if(news.status=="")
// }
</script>

<template>
  <div class="p-10 pt-5 pb-5 text-center md:text-left">
    <RouterLink
      :to="{ name: 'home' }"
      class="sm:px-4 px-1 py-2 bg-white text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 m-10 mt-10 border border-black"
    >
      <span class="font-bold text-xl"> &larr; </span>&nbsp;&nbsp; Back To Home</RouterLink
    >
  </div>

  <div class="sub-route-view min-h-[80vh]">
    <RouterView />
  </div>

  <div class="flex bg-gray-100 rounded-full p-1 md:w-[80%] w-[95%] mx-auto my-10">
    <RouterLink
      :to="{ name: 'news-details-view' }"
      class="flex-1 text-center py-2 rounded-full font-semibold"
      active-class="bg-white shadow"
      exact-active-class="bg-white shadow"
    >
      Details
    </RouterLink>

    <RouterLink
      :to="{ name: 'news-comment-view' }"
      class="flex-1 text-center py-2 rounded-full font-semibold text-gray-700"
      active-class="bg-white shadow"
      exact-active-class="bg-white shadow"
    >
      {{ totalCommentCount }} Comments
    </RouterLink>

    <RouterLink
      :to="{ name: 'news-vote-view' }"
      class="flex-1 text-center py-2 rounded-full font-semibold text-gray-700"
      active-class="bg-white shadow"
      exact-active-class="bg-white shadow"
    >
      Votes
    </RouterLink>
  </div>
</template>
