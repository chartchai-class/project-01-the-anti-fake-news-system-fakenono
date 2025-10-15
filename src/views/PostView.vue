<script setup lang="ts">
import ImageUpload from '@/components/ImageUpload.vue'
import NewsService from '@/services/NewsService'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const topic = ref('')
const details = ref('')
const image = ref([])
const reporter = ref('')

const router = useRouter()

const submitPost = () => {
  const news = {
    topic: topic.value,
    details: details.value,
    image: image.value[0]
      ? image.value[0]
      : 'https://talentclick.com/wp-content/uploads/2021/08/placeholder-image.png',
    reporter: reporter.value,
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
</script>

<template>
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

    <label for="post-reporter" class="text-base md:text-lg font-bold mt-2">Reporter:</label>
    <input
      type="text"
      id="post-reporter"
      class="text-xs md:text-base border border-gray-300 p-2 rounded-lg w-full bg-gray-100 mb-2"
      placeholder="Enter reporter name..."
      v-model="reporter"
      required
    />

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
</template>
