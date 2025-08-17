<script setup lang="ts">
import PercentBar from '@/components/PercentBar.vue'
import Thumb from '@/components/Thumb.vue'
import { useCommentListStore } from '@/stores/commentlists'
import { useNewsStore } from '@/stores/news'
import type { Comment, News } from '@/types'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const commentStore = useCommentListStore()
const { commentlist } = storeToRefs(commentStore)
const vote = ref<number>(0)
const comment = ref<string>('')
const dummy = ref(0)
const realVotes = computed(() => news.value?.verifiedVoteCount || 0)
const fakeVotes = computed(() => news.value?.fakeVoteCount || 0)

function clickBtn() {
  console.log('Vote:', vote.value)
  if (vote.value == 1) {
    newsStore.updateVerifiedVote()
    dummy.value += 1
  } else {
    newsStore.updateFakeVote()
    dummy.value += 1
  }
  if (comment.value) {
    const commentObj: Comment = {
      id: commentlist.value?.length || -99,
      newsId: news.value?.id,
      commenter: 'Anonymous',
      date: new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear(),
      comment: comment.value,
    }
    commentlist.value?.push(commentObj)
  }

  vote.value = 0
  comment.value = ''
}

function createNewsObject(verifiedVote: number, fakeVote: number): News {
  const newNews: News = {
    id: news.value?.id || -99,
    topic: news.value?.topic || '',
    fakeVoteCount: fakeVote,
    verifiedVoteCount: verifiedVote,
    details: news.value?.details || '',
    reporter: news.value?.reporter || '',
    comments: [],
    image: news.value?.image || '',
    status: news.value?.status,
    datetime: news.value?.datetime || new Date(),
  }
  return newNews
}
</script>

<template>
  <div class="voting md:w-[80%] w-[95%] mx-auto mt-10">
    <div class="vote-form-card p-4 rounded-md border border-gray-200">
      <div id="header" class="">
        <h2 class="font-semibold mb-3 text-xl">Vote on Article Authenticity</h2>
        <div id="sub-desc" class="text-sm text-gray-600">
          Help the community by voting whether this news article is authentic or fake.
        </div>
      </div>
      <!-- <div id="form" class="">
                <h2>Your assessment on this article</h2>
                <div id="real">
               <input type="radio" name="vote-news"><span>This news appears to be authentic</span>

                </div>
                <div class="fake">
                    <input type="radio" name="vote-news">
                    <span>This news appears to be fake or misleading</span>
                </div>
                <div class="comment">
                    <h2>Reason for your assessment (Optional)</h2>
                    <textarea name="" id=""></textarea>
                </div>
            </div> -->

      <div id="form" class="bg-white p-6 space-y-5">
        <h2 class="text-lg font-semibold text-gray-900">Your assessment on this article</h2>

        <!-- Authentic option -->
        <label
          class="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer"
        >
          <input
            type="radio"
            name="vote-news"
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            value="1"
            v-model="vote"
          />
          <Thumb :is-up="true" />

          <span class="text-gray-700">This news appears to be authentic</span>
        </label>

        <!-- Fake option -->
        <label
          class="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer"
        >
          <input
            type="radio"
            name="vote-news"
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            value="0"
            v-model="vote"
          />
          <Thumb :is-up="false" />
          <span class="text-gray-700">This news appears to be fake or misleading</span>
        </label>

        <!-- Comment box -->
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-gray-900">
            Reason for your assessment <span class="text-gray-500 text-sm">(Optional)</span>
          </h2>
          <textarea
            rows="4"
            class="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 text-gray-700"
            placeholder="Share your reasoning..."
            v-model="comment"
          ></textarea>
        </div>
        <button
          @click="clickBtn"
          class="w-[10%] bg-transparent border border-black rounded-md text-black hover:cursor-pointer hover:bg-black hover:text-white px-5 py-1 mx-auto"
        >
          Submit
        </button>
      </div>
    </div>

    <div
      class="vote-stat p-5 mt-4 rounded-md border border-gray-200 flex justify-between flex-wrap"
    >
      <div id="stat" class="md:w-[50%] w-[80%] px-10">
        <h2 class="font-semibold text-xl mb-5">Current Stats</h2>
        <div id="realCount" class="flex gap-10 mb-4">
          <span>Real Votes:</span>
          <span>{{ news?.verifiedVoteCount }}</span>
        </div>
        <div id="fakeCount" class="flex gap-10 mb-4">
          <span>Fake Votes:</span>
          <span>{{ news?.fakeVoteCount }}</span>
        </div>
        <div id="status" class="flex gap-10 mb-4">
          <span>Status:</span>
          <div id="status" class="flex-1" v-if="news?.status == 1">
            <div class="bg-green-600 rounded-md w-[25%] text-center text-white">Verified</div>
          </div>
          <div id="status" class="flex-1" v-if="news?.status == 0">
            <div class="bg-red-600 rounded-md w-[25%] text-center text-white">Fake</div>
          </div>
          <div id="status" class="flex-1" v-if="news?.status == 2">
            <div class="bg-gray-600 rounded-md w-[25%] text-center text-white">Pending</div>
          </div>
        </div>
      </div>
      <div id="percent" class="md:w-[50%] w-[90%] flex flex-col gap-y-6">
        <h2 class="font-semibold text-xl">Votes Breakdown</h2>

        <div id="realPercent" class="flex flex-col gap-y-2">
          <PercentBar :realVote="realVotes" :fakeVote="fakeVotes" />
        </div>
      </div>
    </div>
  </div>
</template>
