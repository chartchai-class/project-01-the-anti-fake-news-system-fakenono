<script setup lang="ts">
import PercentBar from '@/components/PercentBar.vue'
import Thumb from '@/components/Thumb.vue'
import { useCommentListStore } from '@/stores/commentlists'
import { useNewsStore } from '@/stores/news'
import { useVoteStore } from '@/stores/votesTrackList'
import type { Comment } from '@/types'
import nProgress from 'nprogress'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const commentStore = useCommentListStore()
const { commentlist } = storeToRefs(commentStore)
const votetrackStore = useVoteStore()
const { votedNews } = storeToRefs(votetrackStore)
const allowMoreVotes = ref<boolean>(false)
const vote = ref<number>(0)
const comment = ref<string>('')
const posted = ref<boolean>(false)
const notiString = ref<string>('')
const imgLink = ref<string>('')
const dummy = ref(0)
const realVotes = computed(() => news.value?.verifiedVoteCount || 0)
const fakeVotes = computed(() => news.value?.fakeVoteCount || 0)
const btnDisable = computed(() => {
  if (!allowMoreVotes.value && votetrackStore.hasVoted(news.value?.id)) {
    return true
  }
  return false
})

function clickBtn() {
  nProgress.start()
  posted.value = true
  console.log('Vote:', vote.value)
  if (vote.value == 1) {
    newsStore.updateVerifiedVote()
    dummy.value += 1
  } else {
    newsStore.updateFakeVote()
    dummy.value += 1
  }
  notiString.value = ' Your vote has been recorded.'
  if (comment.value || imgLink.value) {
    const commentObj: Comment = {
      id: commentlist.value?.length || -99,
      newsId: news.value?.id,
      commenter: 'Anonymous',
      date:
        new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
      comment: comment.value || '',
      imgLink: imgLink.value || '',
    }
    commentlist.value?.push(commentObj)
    notiString.value = ' Your vote and comment have been recorded.'
  }
  nProgress.done()

  vote.value = 0
  comment.value = ''
  imgLink.value = ''
  votetrackStore.markVoted(news.value?.id)
  scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  setTimeout(() => {
    posted.value = false
  }, 3000)
}
</script>

<template>
  <div class="voting md:w-[80%] w-[95%] mx-auto mt-10">
    <div
      id="noti"
      v-if="posted"
      class="animate-fade p-3 text-white text-xl font-bold mb-2 text-center"
    >
      {{ notiString }}
    </div>
    <div class="vote-form-card p-4 rounded-md border border-gray-200">
      <div id="header" class="">
        <h2 class="font-semibold mb-3 text-xl">Vote on Article Authenticity</h2>
        <div id="sub-desc" class="text-sm text-gray-600">
          Help the community by voting whether this news article is authentic or fake.
        </div>
      </div>

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
          <input
            type="text"
            v-model="imgLink"
            placeholder="Image link (optional)"
            class="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 text-gray-700"
          />
        </div>
        <button
          @click="clickBtn"
          :disabled="btnDisable"
          class="md:w-[10%] w-[30%] bg-transparent border border-black rounded-md text-black hover:cursor-pointer hover:bg-black hover:text-white px-5 py-1 mx-auto"
          :class="{ 'opacity-50 cursor-not-allowed hover:cursor-not-allowed': btnDisable }"
        >
          Submit
        </button>
        <div v-if="btnDisable">You have already submitted a vote for this article.</div>
      </div>
    </div>

    <div
      class="vote-stat p-5 mt-4 rounded-md border border-gray-200 flex justify-between flex-wrap"
    >
      <div id="stat" class="md:w-[50%] w-[80%] md:px-10">
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
            <div class="bg-green-600 rounded-md md:w-[25%] w-[50%] text-center text-white">
              Verified
            </div>
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
    <div class="vote-rules mt-4 p-4 border border-gray-200 rounded-md">
      <h2 class="font-semibold text-xl mb-2">Decision Rules for News Status</h2>
      <ul class="list-disc pl-5">
        <li class="mb-2">
          If the real votes are more than 60% of total votes, the news is marked as
          <strong class="bg-green-600 text-white border rounded-lg px-2 font-semibold mx-2"
            >Verified</strong
          >.
        </li>
        <li class="mb-2">
          If the fake votes are more than 60% of total votes, the news is marked as
          <strong class="bg-red-600 text-white border rounded-lg px-2 font-semibold mx-2"
            >Fake</strong
          >.
        </li>
        <li class="mb-2">
          If total votes are less than 20, the news is marked as
          <strong class="bg-gray-600 text-white border rounded-lg px-2 font-semibold mx-2"
            >Pending</strong
          >
          state.
        </li>
        <li class="font-semibold text-red-700">
          User can vote only once per article. <br />For testing purpose, you can enabled test
          feature which will allow you to vote multiple times.
          <br />
          <!-- Toggle button -->
          <label class="inline-flex items-center mt-3">
            <input
              type="checkbox"
              class="form-checkbox h-5 w-5 text-blue-600"
              v-model="allowMoreVotes"
            />
            <span class="ml-2 text-gray-700">Enable Test Feature</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>
