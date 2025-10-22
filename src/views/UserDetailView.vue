<script setup lang="ts">
import NewsCardListForm from '@/components/NewsCardListForm.vue'
import { useAuthStore } from '@/stores/auth'
import { UserRoles } from '@/types'
import { EnvelopeIcon } from '@heroicons/vue/16/solid'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()

onMounted(() => {
  if (!user) {
    router.push({ name: '404-resource-view', params: { resource: 'User' } })
  }
})
const image_url =
  user?.imageUrl ??
  'https://images.nightcafe.studio/users/ZcDYVAlvjNbsAHbwNhUFxdU0rXs2/uploads/m7XuV1i6egth4ISiD240.jpeg?tr=w-1600,c-at_max'
</script>

<template>
  <div class="md:w-[80%] w-[95%] mx-auto mt-10">
    <!-- <div class="user-detail flex flex-row w-[100%]">
      <div class="profile-image w-[10%]">
        <img :src="image_url" alt="profile image" class="w-[90%]" />
      </div>
      <div class="detail w-[100%]">
        <div>
          <div class="name">{{ user?.name }} {{ user?.roles }}</div>
          <div class="username">@{{ user?.username }}</div>
          <div class="email">
            <span>{{ user?.email }}</span> <span>Joined at {{ user?.createdAt }}</span>
          </div>
        </div>
        <div class="flex flex-row w-[100%] text-center">
          <div class="w-[20%] mx-2">
            <div class="card bg-slate-200 p-4 py-6">
              <div class="text">1</div>
              <div>News Posted</div>
            </div>
          </div>
          <div class="w-[20%] mx-2">
            <div class="card bg-zinc-200 p-4 py-6">
              <div class="">2</div>
              <div>Votes Cast</div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
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
            <EnvelopeIcon class="h-6 w-6 text-black" />
            <span>{{ user?.email }}</span> •
            <span class="text-gray-400"
              >Joined since {{ new Date(user!.createdAt).toLocaleDateString() }}</span
            >
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="flex justify-center sm:justify-start flex-wrap gap-3 mt-6 text-center">
          <div class="bg-slate-100 rounded-xl px-5 py-4 shadow-sm w-30">
            <div class="text-xl font-semibold text-gray-800">1</div>
            <div class="text-sm text-gray-500">News Posted</div>
          </div>
          <div class="bg-slate-100 rounded-xl px-5 py-4 shadow-sm w-28">
            <div class="text-xl font-semibold text-gray-800">2</div>
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

      <div v-for="news in user?.postedNews" :key="news.id" class="news-list">
        <NewsCardListForm :news="news" />
      </div>
    </div>
  </div>
</template>
