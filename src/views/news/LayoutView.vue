<script setup lang="ts">
import { isAuthorize } from '@/authorizationHelper'
import CommentService from '@/services/CommentService'
import { useAuthStore } from '@/stores/auth'
import { useCommentCountStore } from '@/stores/commentlists'
import { useNewsStore } from '@/stores/news'
import { UserRoles } from '@/types'
import { computed, onMounted, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

const newsId = parseInt(useRoute().params.id.toString())
const router = useRouter()
const totalCommentCount = computed(() => {
  return commentCountStore.count
})
const newsStore = useNewsStore()
const authStore = useAuthStore()
const commentCountStore = useCommentCountStore()
const isAdmin = computed(() => {
  return isAuthorize([UserRoles.ROLE_ADMIN])
})

onMounted(() => {
  console.log('User', authStore.user)
  loadNews()
  watch(
    isAdmin,
    () => {
      commentCountStore.setCount(newsId)
    },
    {
      immediate: true,
    },
  )
})

function loadNews() {
  CommentService.getNewsById(newsId) //This should use NewService
    .then((response) => {
      newsStore.setNews(response.data)
      console.log(newsStore.news)
    })
    .catch((err) => {
      console.log(err)
      router.push({ name: '404-resource-view', params: { resource: 'News' } })
    })
}
onBeforeRouteLeave(() => {
  newsStore.setNews(null)
})
</script>

<template>
  <div class="p-10 pt-5 pb-5 text-center md:text-left">
    <RouterLink
      :to="{ name: 'home' }"
      class="sm:px-4 px-1 py-2 bg-white text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 m-10 mt-10 border border-black"
    >
      <span class="font-bold text-xl hidden md:inline-block"> &larr; </span
      ><span class="hidden md:inline">&nbsp;&nbsp;</span> Back To Home</RouterLink
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
