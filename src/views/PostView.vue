<script setup lang="ts">
import ImageUpload from '@/components/ImageUpload.vue'
import NewsService from '@/services/NewsService'
import UserService from '@/services/UserService'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const topic = ref('')
const details = ref('')
const image = ref([])
const reporter = ref('')

const router = useRouter()
const authStore = useAuthStore()

const submitPost = () => {
  const news = {
    topic: topic.value,
    details: details.value,
    image: image.value[0]
      ? image.value[0]
      : 'https://talentclick.com/wp-content/uploads/2021/08/placeholder-image.png',
    reporter: {
      username: authStore.currentUserName,
    },
    comments: [],
  }

  NewsService.postNews(news)
    .then(
      (response) => {
        console.log('News posted successfully:', response.data)
      },
      (error) => {
        console.error('Failed to post news:', error)
      },
    )
    .then(() => {
      topic.value = ''
      details.value = ''
      image.value = []
      reporter.value = ''

      router.push({ name: 'home' })
    })
}

function cancelPost() {
  topic.value = ''
  details.value = ''
  image.value = []
  reporter.value = ''
  router.push({ name: 'home' })
}

const user: User = ref<User>()
onMounted(() => {
  UserService.getUserById(authStore.user.id).then((response) => {
    user.value = response.data
  })
})
const isMember = computed(() => {
  return user.value?.roles.includes('ROLE_MEMBER')
})
</script>

<template>
  <div
    v-if="!isMember"
    class="flex flex-col items-center border p-8 m-4 md:m-16 rounded-lg shadow-lg fixed bg-white z-50 w-[50%] left-[20%] top-[20%]"
  >
    <h3 class="text-lg lg:text-xl font-bold mb-2 mt-4">You must be a member to post news.</h3>
    <p v-if="!authStore.isReader" class="text-gray-600 mb-4">
      Please
      <RouterLink :to="{ name: 'registration-view' }" class="text-black font-semibold"
        >Sign Up</RouterLink
      >
      or
      <RouterLink :to="{ name: 'login-view' }" class="text-black font-semibold">Log In</RouterLink>
      to your account.
    </p>
    <p v-if="authStore.isReader" class="text-gray-600 mb-4">
      <RouterLink :to="{ name: 'user-detail-view' }" class="text-black font-semibold"
        >Upgrade to a member</RouterLink
      >
      to post news.
    </p>
    <button
      class="bg-black text-white rounded-lg p-2 px-4 m-4 hover:bg-gray-800"
      @click="router.push({ name: 'home' })"
    >
      Go Back Home
    </button>
  </div>
  <div :class="isMember ? '' : 'opacity-20 pointer-events-none'">
    <h1 class="text-xl lg:text-3xl font-bold mb-2 mt-8 ml-16">Create a New Post</h1>
    <form
      @submit.prevent="submitPost"
      class="flex flex-col items-start border p-8 m-4 md:m-16 rounded-lg shadow-lg"
    >
      <label for="post-topic" class="text-base md:text-lg font-bold mt-2">Title:</label>
      <input
        type="text"
        id="post-topic"
        class="text-xs md:text-base border border-gray-300 p-2 rounded-lg w-full bg-gray-100 mb-2"
        placeholder="Enter news title..."
        v-model="topic"
        required
      />

      <label for="post-details" class="text-base md:text-lg font-bold mt-2">Details:</label>
      <textarea
        id="post-details"
        class="text-xs md:text-base border border-gray-300 p-2 rounded-lg w-full h-40 bg-gray-100 mb-2"
        placeholder="Enter news details..."
        v-model="details"
        required
      ></textarea>

      <label for="post-image" class="text-base md:text-lg font-bold mt-2"
        >Image URL (Optional):</label
      >
      <ImageUpload v-model="image" :multiple="false" :max="1" />

      <div class="flex flex-row justify-center w-full font-semibold text-base md:text-lg">
        <button
          type="button"
          class="bg-gray-300 text-gray-700 rounded-lg p-1 px-2 m-2 md:p-3 md:px-8 md:m-4"
          @click="cancelPost"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-black text-white rounded-lg p-1 px-2 m-2 md:p-3 md:px-8 md:m-4"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
