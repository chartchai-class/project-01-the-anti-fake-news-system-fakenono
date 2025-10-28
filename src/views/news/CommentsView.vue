<script setup lang="ts">
import { isAuthorize } from '@/authorizationHelper'
import CommentService from '@/services/CommentService'
import NewsService from '@/services/NewsService'
import { useCommentCountStore, useCommentListStore } from '@/stores/commentlists'
import { useNewsStore } from '@/stores/news'
import { useVoteDataStore } from '@/stores/votesTrackList'
import { NewsStatus, UserRoles } from '@/types'
import nProgress from 'nprogress'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useToast } from 'vue-toastification'

const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const commentListStore = useCommentListStore()
const commentCountStore = useCommentCountStore()
const { commentlist } = storeToRefs(commentListStore)
const totalCommentCount = computed(() => {
  return commentCountStore.count
})
const perPage = ref(6)
const pages = computed(() => {
  return Math.ceil((totalCommentCount.value ?? 0) / perPage.value)
})
const currentPage = ref(1)
const props = defineProps<{ id: number }>() //newsId
const isAdmin = computed(() => {
  return isAuthorize([UserRoles.ROLE_ADMIN])
})
const emptyImageUrl = import.meta.env.VITE_EMPTY_IMAGE_URL

const voteDataStore = useVoteDataStore()
// const realVote = computed(() => {
//   return voteDataStore.voteData?.realVoteCount
// })
// const fakeVote = computed(() => {
//   return voteDataStore.voteData?.fakeVoteCount
// })

const toast = useToast()

onMounted(() => {
  watchEffect(() => {
    //This will refetch when perPage and page changes
    fetchComments()
  })
  watch(isAdmin, () => {
    //This will refetch when isAdmin changes
    currentPage.value = 1
    fetchComments()
  })
})

function fetchComments() {
  nProgress.start()
  CommentService.getCommentsByNewsId(props.id, perPage.value, currentPage.value).then(
    (response) => {
      commentlist.value = response.data
      commentCountStore.setCountNum(parseInt(response.headers['x-total-count']))
      voteDataStore.setVotes(props.id)
      voteDataStore.setVotes(props.id)
      // News need to be refetched
      nProgress.done()
    },
  )
}

function fetchNews() {
  NewsService.getNewsById(props.id).then((response) => {
    newsStore.setNews(response.data)
  })
}

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

function deleteCommentHandle(commentId: number) {
  CommentService.deleteComment(commentId)
    .then((response) => {
      toast.success('The comment has been successfully deleted!')
      console.log(response.status)
      fetchComments()
      fetchNews()
    })
    .catch(() => {
      toast.error('Error occurred!')
    })
}

onBeforeRouteLeave(() => {
  commentlist.value = null
})
</script>

<template>
  <div class="comment md:w-[80%] w-[90%] mx-auto mt-10">
    <div class="header border-b-2 border-gray-900 pb-2 mb-5" id="cmt-header">
      <div class="h2 text-2xl font-semibold mb-5">Comments & Discussion</div>
      <div class="desc text-gray-600">
        Discussion about <span class="font-bold"> "{{ news?.topic }}"</span>
      </div>
      <div class="flex flex-wrap gap-4 mt-2">
        <!-- <div id="upvoke " class="text-green-600">{{ realVote }} real votes</div>
        <div id="downvoke" class="text-red-600">{{ fakeVote }} fake votes</div> -->
        <div id="status" class="px-2" v-if="news?.status == NewsStatus.Verified">
          <div class="bg-green-600 rounded-md text-center text-white">Verified</div>
        </div>
        <div id="status" class="px-2" v-if="news?.status == NewsStatus.Fake">
          <div class="bg-red-600 rounded-md text-center text-white">Fake</div>
        </div>
        <div id="status" class="px-2" v-if="news?.status == NewsStatus.Pending">
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
        :class="{
          'opacity-50 italic pointer-events-none': cmt.deleted,
        }"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-gray-900 font-semibold flex gap-2 items-center">
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <!-- <span class="text-sm font-medium text-gray-600">{{
                cmt.commenter?.substring(0, 2).toUpperCase()
              }}</span> -->
              <img
                :src="cmt.commenter?.imageUrl || emptyImageUrl"
                alt=""
                class="w-8 h-8 rounded-full"
              />
            </div>
            {{ cmt.commenter?.username }}
          </h3>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">{{
              new Date(cmt.date!).toLocaleDateString()
            }}</span>
            <button
              v-if="isAdmin && !cmt.deleted"
              class="text-red-500 hover:text-red-700 text-sm font-medium"
              @click="deleteCommentHandle(cmt.id!)"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Comment -->
        <p class="text-gray-700 leading-relaxed text-sm">
          {{ cmt.comment }} <br />
          <span class="italic text-red-600" v-if="cmt.deleted">This comment has been deleted!</span>
        </p>

        <div class="mt-2">
          <img
            v-if="cmt.imageLink"
            :src="cmt.imageLink"
            alt="Comment Image"
            class="max-w-full rounded-md w-[200px]"
          />
          <br />
          <span class="text-sm text-gray-500" v-if="cmt.imageLink"
            ><a :href="cmt.imageLink" target="_blank">View Image</a></span
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
