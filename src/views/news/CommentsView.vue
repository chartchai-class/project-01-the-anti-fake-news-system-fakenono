<script setup lang="ts">
import CommentService from '@/services/CommentService'
import { useCommentListStore } from '@/stores/commentlists'
import { useNewsStore } from '@/stores/news'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watchEffect } from 'vue'

const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const commentListStore = useCommentListStore()
const { commentlist } = storeToRefs(commentListStore)
const totalCommentCount = ref(0)
const perPage = ref(6)
const pages = computed(() => {
  return Math.ceil((totalCommentCount.value ?? 0) / perPage.value)
})
const currentPage = ref(1)
const props = defineProps<{ id: number }>()

onMounted(() => {
  watchEffect(() => {
    console.log('PerPage:', perPage.value)
    console.log('CurrentPage:', currentPage.value)
    CommentService.getCommentsByNewsId(props.id, perPage.value, currentPage.value).then(
      (response) => {
        commentlist.value = response.data
        totalCommentCount.value = parseInt(response.headers['x-total-count'])
      },
    )
  })
})
// Slice comments for current page
const paginatedComments = computed(() => {
  const allComments = commentlist.value || []
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return allComments.slice(start, end)
})

const hasNextPage = () => {
  return currentPage.value < pages.value
}
const hasPrePage = () => {
  return currentPage.value > 1
}

function increase() {
  currentPage.value += 1
}

function decrease() {
  currentPage.value -= 1
}
</script>

<template>
  <div class="comment md:w-[80%] w-[95%] mx-auto mt-10">
    <div class="header border-b-2 border-gray-900 pb-2 mb-5" id="cmt-header">
      <div class="h2 text-2xl font-semibold mb-5">Comments & Discussion</div>
      <div class="desc text-gray-600">
        Discussion about <span class="font-bold"> "{{ news?.topic }}"</span>
      </div>
      <div class="flex flex-wrap gap-4 mt-2">
        <div id="upvoke " class="text-green-600">{{ news?.verifiedVoteCount }} real votes</div>
        <div id="downvoke" class="text-red-600">{{ news?.fakeVoteCount }} fake votes</div>
        <div id="status" class="px-2" v-if="news?.status == 1">
          <div class="bg-green-600 rounded-md text-center text-white">Verified</div>
        </div>
        <div id="status" class="px-2" v-if="news?.status == 0">
          <div class="bg-red-600 rounded-md text-center text-white">Fake</div>
        </div>
        <div id="status" class="px-2" v-if="news?.status == 2">
          <div class="bg-gray-600 rounded-md text-center text-white">Pending</div>
        </div>

        <div id="commentCount" class="">{{ totalCommentCount }} comments</div>
      </div>
    </div>
    <div id="cmt-list" v-if="news">
      <div
        class="mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4"
        v-for="(cmt, index) in commentlist"
        :key="index"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-gray-900 font-semibold flex gap-2 items-center">
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600">{{
                cmt.commenter?.substring(0, 2).toUpperCase()
              }}</span>
            </div>
            {{ cmt.commenter }}
          </h3>
          <span class="text-sm text-gray-500">{{ new Date(cmt.date).toLocaleDateString() }}</span>
        </div>

        <!-- Comment -->
        <p class="text-gray-700 leading-relaxed text-sm">
          {{ cmt.comment }}
        </p>
        <div class="mt-2">
          <img
            v-if="cmt.imgLink"
            :src="cmt.imgLink"
            alt="Comment Image"
            class="max-w-full rounded-md w-[200px]"
          />
          <br />
          <span class="text-sm text-gray-500" v-if="cmt.imgLink"
            ><a :href="cmt.imgLink" target="_blank">View Image</a></span
          >
        </div>
      </div>
    </div>
    <div class="btn lg:w-[40%] w-[90%] mx-auto flex flex-row justify-between">
      <button
        @click="decrease"
        :disabled="!hasPrePage()"
        class="px-2 py-1 bg-white text-black rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 border border-black disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-100"
      >
        Previous
      </button>
      <div class="">Page:{{ currentPage }}</div>
      <button
        @click="increase"
        :disabled="!hasNextPage()"
        class="px-2 py-1 bg-white text-black rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 border border-black disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-100"
      >
        Next
      </button>
    </div>
  </div>
</template>
