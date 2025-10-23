<script setup lang="ts">
import DashboardCompareCard from '@/components/DashboardCompareCard.vue'
import DashboardCountCard from '@/components/DashboardCountCard.vue'
import NewsStatusPieChart from '@/components/NewsStatusPieChart.vue'
import DashboardService from '@/services/DashboardService'
import type { DashboardStats } from '@/types'
import {
  ArrowLeftIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  NewspaperIcon,
  UserGroupIcon,
} from '@heroicons/vue/16/solid'
import { onMounted, ref } from 'vue'

const stats = ref<DashboardStats>()
onMounted(() => {
  DashboardService.getDashboardStats().then((response) => {
    stats.value = response.data
  })
})
</script>

<template>
  <div class="m-4">
    <RouterLink :to="{ name: 'home' }" class="flex flex-row justify-start">
      <ArrowLeftIcon class="h-6 w-6 text-black mb-4 cursor-pointer" />
      Back
    </RouterLink>
    <h1 class="text-xl font-bold">Dashboard</h1>
  </div>

  <div class="flex flex-col">
    <div class="flex flex-row">
      <DashboardCountCard
        title="Total Users"
        :count="stats?.userCount"
        :icon="UserGroupIcon"
        class="m-4 text-blue-600 bg-blue-200 bg-opacity-50"
      />
      <DashboardCountCard
        title="Total News Posts"
        :count="stats?.newsCount"
        :icon="NewspaperIcon"
        class="m-4 text-green-600 bg-green-200 bg-opacity-50"
      />
      <DashboardCountCard
        title="Total Comments"
        :count="stats?.voteCount"
        :icon="ChatBubbleLeftRightIcon"
        class="m-4 text-purple-600 bg-purple-200 bg-opacity-50"
      />
    </div>

    <div class="flex flex-row">
      <DashboardCompareCard
        label-a="Readers"
        :value-a="stats?.readersCount"
        label-b="Members"
        :value-b="stats?.membersCount"
        class="m-4 w-[45%] bg-teal-200 bg-opacity-50 text-teal-600"
        :icon="BookOpenIcon"
      />
      <DashboardCompareCard
        label-a="Real Vote"
        :value-a="stats?.realVotesCount"
        label-b="Fake Vote"
        :value-b="stats?.fakeVotesCount"
        class="m-4 w-[45%] bg-amber-200 bg-opacity-50 text-amber-600"
        :icon="CheckBadgeIcon"
      />
    </div>
    <div class="border rounded-lg p-4 w-[90%] mx-auto bg-opacity-10 bg-neutral-200">
      <h3 class="text-xl font-bold">News Verification Status</h3>
      <NewsStatusPieChart
        :verifiedCount="stats?.verifiedNewsCount || 0"
        :fakeCount="stats?.fakeNewsCount || 0"
        :pendingCount="stats?.pendingNewsCount || 0"
        class="w-[30%] justify-self-center"
      />
    </div>
  </div>
</template>
