<script setup lang="ts">
import { isAuthorize } from '@/authorizationHelper'
import ImageUpload from '@/components/ImageUpload.vue'
import PercentBar from '@/components/PercentBar.vue'
import Thumb from '@/components/Thumb.vue'
import CommentService from '@/services/CommentService'
import NewsService from '@/services/NewsService'
import VoteCommentService from '@/services/VoteCommentService'
import { useAuthStore } from '@/stores/auth'
import { useCommentCountStore } from '@/stores/commentlists'
import { useNewsStore } from '@/stores/news'
import { useVoteDataStore } from '@/stores/votesTrackList'
import { UserRoles, VoteType, type Comment, type Vote } from '@/types'
import nProgress from 'nprogress'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const voteType = ref<number>(0)
const comment = ref<string>('')
const posted = ref<boolean>(false)
const notiString = ref<string>('')
const imgLink = ref<string[]>([])
const realVotes = computed(() => voteDataStore.voteData?.realVoteCount || 0)
const fakeVotes = computed(() => voteDataStore.voteData?.fakeVoteCount || 0)
const voteToPost = ref<Vote>({ voteType: VoteType.Fake })
const commentToPost = ref<Comment>({
  comment: '',
})
//Get news id
const props = defineProps<{ id: number }>()

const isAuthorized = computed(() => {
  return isAuthorize([UserRoles.ROLE_READER])
})
const commentCountStore = useCommentCountStore()
const voteDataStore = useVoteDataStore()
const btnDisable = computed(() => {
  if (comment.value.trim() == '') {
    return true
  }
  return false
})
const toast = useToast()
const newsId = props.id
const isLoading = ref<boolean>(true)
onMounted(() => {
  voteDataStore.setVotes(props.id)
  CommentService.getNewsById(newsId).then((response) => {
    newsStore.setNews(response.data)
    if (authUser.user) {
      NewsService.getHasCommented(news.value!.id, authUser.user!.id)
        .then((response) => {
          hasCommented.value = response.data
        })
        .finally(() => {
          isLoading.value = false
        })
    } else {
      isLoading.value = false
    }
  })
  console.log('User', authUser.user)
  console.log('News', news.value)
  watch(userStoreRef.user, (newUser) => {
    if (!newUser) {
      hasCommented.value = false
    }
  })
})
const isFocus = ref<boolean>(false)
const authUser = useAuthStore()
const newsReporter = computed(() => {
  return news.value?.reporter
})

const isOwnNews = computed(() => {
  return authUser.user?.id == newsReporter.value?.id
})
const uploader = ref<InstanceType<typeof ImageUpload> | null>(null)
const hasCommented = ref<boolean>()
const userStoreRef = storeToRefs(authUser)

/**
 * Should add function to check whether user is reader or unknown
 * If reader , check whether he/she already has voted on this news
 * If voted , shown Something instead of vote form
 */
function validateInput() {
  console.log('Vote:', voteType.value)
  if (voteType.value == 0) {
    voteToPost.value.voteType = VoteType.Real
  } else {
    voteToPost.value.voteType = VoteType.Fake
  }
  console.log('VoteType:', voteToPost.value.voteType)
  commentToPost.value.comment = comment.value
  commentToPost.value.imageLink = imgLink.value[0]

  if (commentToPost.value.comment == '') {
    console.log('Comment not filled!')
    nProgress.done()
    notiString.value = 'Add Comment'
    setTimeout(() => {
      posted.value = false
    }, 3000)
    return false
  }
  return true
}
function clickBtn() {
  nProgress.start()
  // posted.value = true

  if (!validateInput()) {
    return
  }

  // news id received from props from layoutview, in router

  const user = useAuthStore().user
  console.log('Posted Comment:', comment.value)
  VoteCommentService.postVoteAndComment(commentToPost.value, voteToPost.value, newsId, user!)
    .then((response) => {
      console.log(response.status, 'Post Done')
      notiString.value = ' Your vote has been recorded.'
      CommentService.getNewsById(newsId).then((response) => {
        newsStore.setNews(response.data)
      })
      commentCountStore.setCount(newsId)
      voteDataStore.setVotes(newsId)
      nProgress.done()
      toast.success('Your vote has been saved!')

      voteType.value = 0
      comment.value = ''
      imgLink.value = []
      uploader.value.resetUploader()

      NewsService.getHasCommented(news.value!.id, authUser.user!.id).then((response) => {
        hasCommented.value = response.data
      })

      // scrollTo({
      //   top: 0,
      //   behavior: 'smooth',
      // })
      setTimeout(() => {
        posted.value = false
      }, 3000)
    })
    .catch(() => {
      toast.error('Error Occured!')
    })
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

      <div v-if="isLoading">
        <div class="text-center">Loading...</div>
      </div>
      <div v-else>
        <div
          id="form"
          class="bg-white p-6 space-y-5"
          v-if="isAuthorized && !isOwnNews && !hasCommented"
        >
          <h2 class="text-lg font-semibold text-gray-900">Your assessment on this article</h2>

          <!-- Authentic option -->
          <label
            class="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer"
          >
            <input
              type="radio"
              name="vote-news"
              class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              value="0"
              v-model="voteType"
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
              value="1"
              v-model="voteType"
            />
            <Thumb :is-up="false" />
            <span class="text-gray-700">This news appears to be fake or misleading</span>
          </label>

          <!-- Comment box -->
          <div class="space-y-2">
            <h2 class="text-lg font-semibold text-gray-900">Reason for your assessment</h2>
            <div v-if="comment.trim() == '' && isFocus" class="text-red-500">
              This field is required
            </div>

            <textarea
              rows="4"
              class="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 text-gray-700"
              placeholder="Share your reasoning..."
              v-model="comment"
              required
              @focus="isFocus = true"
              @blur="isFocus = false"
            ></textarea>
            <!-- <input
            type="text"
            v-model="imgLink"
            placeholder="Image link (optional)"
            class="w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 text-gray-700"
          /> -->
            <ImageUpload v-model="imgLink" :multiple="false" :max="1" ref="uploader" />
          </div>
          <button
            @click="clickBtn"
            :disabled="btnDisable"
            class="md:w-[10%] w-[40%] bg-transparent border border-black rounded-md text-black hover:cursor-pointer hover:bg-black hover:text-white px-5 py-1 mx-auto"
            :class="{ 'opacity-50 cursor-not-allowed hover:cursor-not-allowed': btnDisable }"
          >
            Submit
          </button>
          <!-- <div v-if="btnDisable">Please Fill Al</div> -->
        </div>
        <div
          class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded"
          v-else-if="isOwnNews"
        >
          <p><strong>Note:</strong> You are the author of this news. Voting is disabled for you.</p>
        </div>
        <div
          class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded"
          v-else-if="hasCommented"
        >
          <p><strong>Note:</strong> You have already submitted a vote for this news.</p>
        </div>

        <div id="form" class="bg-white p-6 space-y-5" v-else>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">
            You must be logged in to vote on this article
          </h2>
          <p class="text-gray-600 mb-4">
            Please log in or create an account to share your opinion and help verify news
            authenticity.
          </p>

          <div class="flex gap-4">
            <RouterLink
              :to="{ name: 'login-view' }"
              class="px-5 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-200"
            >
              Log In
            </RouterLink>

            <RouterLink
              :to="{ name: 'registration-view' }"
              class="px-5 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-600 hover:text-white transition duration-200"
            >
              Register
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    <div
      class="vote-stat p-5 mt-4 rounded-md border border-gray-200 flex justify-between flex-wrap"
    >
      <div id="stat" class="md:w-[50%] w-[80%] md:px-10">
        <h2 class="font-semibold text-xl mb-5">Current Stats</h2>
        <div id="realCount" class="flex gap-10 mb-4">
          <span>Real Votes:</span>
          <span>{{ realVotes }}</span>
        </div>
        <div id="fakeCount" class="flex gap-10 mb-4">
          <span>Fake Votes:</span>
          <span>{{ fakeVotes }}</span>
        </div>
        <div id="status" class="flex gap-10 mb-4">
          <span>Status:</span>
          <div id="status" class="flex-1" v-if="news?.status == 'Verified'">
            <div class="bg-green-600 rounded-md md:w-[25%] w-[50%] text-center text-white">
              Verified
            </div>
          </div>
          <div id="status" class="flex-1" v-if="news?.status == 'Fake'">
            <div class="bg-red-600 rounded-md w-[50%] sm:w-[35%] text-center text-white">Fake</div>
          </div>
          <div id="status" class="flex-1" v-if="news?.status == 'Pending'">
            <div class="bg-gray-600 rounded-md text-center text-white w-[50%] lg:w-[35%]">
              Pending
            </div>
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
          If the fake votes are more than 40% of total votes, the news is marked as
          <strong class="bg-red-600 text-white border rounded-lg px-2 font-semibold mx-2"
            >Fake</strong
          >.
        </li>
        <li class="mb-2">
          If total votes are less than 5, the news is marked as
          <strong class="bg-gray-600 text-white border rounded-lg px-2 font-semibold mx-2"
            >Pending</strong
          >
          state.
        </li>
        <li class="font-semibold text-red-700">User can vote only once per article.</li>
      </ul>
    </div>
  </div>
</template>
