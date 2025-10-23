<script setup lang="ts">
import NewsCardListForm from '@/components/NewsCardListForm.vue'
import NewsService from '@/services/NewsService'
import VoteCommentService from '@/services/VoteCommentService'
import { useAuthStore } from '@/stores/auth'
import { UserRoles, type News } from '@/types'
import { EnvelopeIcon } from '@heroicons/vue/16/solid'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()
const postedNews = ref<News[]>([])
const postedNewsCount = computed(() => {
  return postedNews.value.length
})
const totalVoteCount = ref<number>()

onMounted(() => {
  if (!user) {
    router.push({ name: '404-resource-view', params: { resource: 'User' } })
  }
  NewsService.getNewsByUserId(user!.id).then((response) => {
    postedNews.value = response.data
  })
  VoteCommentService.getVoteByUserId(user!.id).then((response) => {
    totalVoteCount.value = Number(response.data)
  })
})
const image_url =
  user?.imageUrl ??
  'https://images.nightcafe.studio/users/ZcDYVAlvjNbsAHbwNhUFxdU0rXs2/uploads/m7XuV1i6egth4ISiD240.jpeg?tr=w-1600,c-at_max'
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
  <div class="md:w-[80%] w-[95%] mx-auto mt-10">
    <div
      class="user-detail flex flex-col sm:flex-row items-center sm:items-start bg-white rounded-2xl shadow-md p-6 w-full max-w-4xl mx-auto"
    >
      <!-- Profile Image -->
      <div
        class="profile-image w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-300"
      >
        <img :src="image_url" alt="profile image" class="w-full h-full object-cover" />
      </div>

      <!-- User Info -->
      <div class="detail flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
        <div class="space-y-1">
          <div class="text-2xl font-semibold text-gray-800">
            {{ user?.name }}
            <span
              v-if="user?.roles.includes(UserRoles.ROLE_ADMIN)"
              class="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-full"
            >
              ADMIN
            </span>

            <span
              v-else-if="user?.roles.includes(UserRoles.ROLE_MEMBER)"
              class="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full"
            >
              MEMBER
            </span>

            <span
              v-else-if="user?.roles.includes(UserRoles.ROLE_READER)"
              class="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full"
            >
              READER
            </span>
          </div>
          <div class="text-gray-500">@{{ user?.username }}</div>
          <div class="text-sm text-gray-600">
            <EnvelopeIcon class="h-6 w-6 text-black inline" />
            <span>{{ user?.email }}</span> •
            <span class="text-gray-400"
              >Joined since {{ new Date(user!.createdAt).toLocaleDateString() }}</span
            >
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="flex justify-center sm:justify-start flex-wrap gap-3 mt-6 text-center">
          <div class="bg-slate-100 rounded-xl px-5 py-4 shadow-sm w-30">
            <div class="text-xl font-semibold text-gray-800">{{ postedNewsCount }}</div>
            <div class="text-sm text-gray-500">News Posted</div>
          </div>
          <div class="bg-slate-100 rounded-xl px-5 py-4 shadow-sm w-28">
            <div class="text-xl font-semibold text-gray-800">{{ totalVoteCount }}</div>
            <div class="text-sm text-gray-500">Votes Cast</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="posted-news px-4 md:px-8 py-6 bg-gray-50 rounded-2xl shadow-sm w-full max-w-4xl mx-auto mt-2"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-2">
        Posted News
      </h2>

      <div v-for="news in postedNews" :key="news.id" class="news-list">
        <NewsCardListForm :news="news" />
      </div>
    </div>
  </div>
</template>
