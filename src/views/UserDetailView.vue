<script setup lang="ts">
import NewsCardListForm from '@/components/NewsCardListForm.vue'
import NewsService from '@/services/NewsService'
import RoleRequestService from '@/services/RoleRequestService'
import UserService from '@/services/UserService'
import VoteCommentService from '@/services/VoteCommentService'
import { useAuthStore } from '@/stores/auth'
import { RoleRequestStatus, UserRoles, type News, type RoleRequest, type User } from '@/types'
import { EnvelopeIcon } from '@heroicons/vue/16/solid'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const user = ref<User>()
const router = useRouter()
const postedNews = ref<News[]>([])
const postedNewsCount = computed(() => {
  return postedNews.value.length
})

const totalVoteCount = ref<number>()
const roleRequest = ref<RoleRequest>()
const hasRequested = ref<boolean>()
function getRoleRequest() {
  RoleRequestService.getRoleRequest(user.value!.id)
    .then((response) => {
      roleRequest.value = response.data
      hasRequested.value = true
      console.log(typeof roleRequest.value?.requestStatus)
      //console.log(roleRequest.value == undefined)
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 404) {
          hasRequested.value = false
        } else {
          console.log('Server error:', err.response.status)
        }
      }
    })
}

onMounted(() => {
  if (!authStore.user) {
    router.push({ name: '404-resource-view', params: { resource: 'User' } })
  }
  UserService.getUserById(authStore.user!.id).then((response) => {
    user.value = response.data
    console.log(user.value)
    getRoleRequest()
    NewsService.getNewsByUserId(user.value!.id).then((response) => {
      postedNews.value = response.data
    })
    VoteCommentService.getVoteByUserId(user.value!.id).then((response) => {
      totalVoteCount.value = Number(response.data)
    })
  })
  //   UserService.getUserById(authStore.user!.id).then((response) => {
  //     user.value = response.data
  //     console.log(user.value)
  //     getRoleRequest()
  //   })
})
const image_url = computed(() => {
  return (
    user.value?.imageUrl ??
    'https://images.nightcafe.studio/users/ZcDYVAlvjNbsAHbwNhUFxdU0rXs2/uploads/m7XuV1i6egth4ISiD240.jpeg?tr=w-1600,c-at_max'
  )
})
const toast = useToast()
const requestHandle = () => {
  RoleRequestService.postRoleRequest(user.value!.id)
    .then((response) => {
      toast.success('Requested Successfully')
      getRoleRequest()
    })
    .catch(() => {
      toast.error('Error')
    })
}
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
              >Joined since {{ new Date(user?.createdAt).toLocaleDateString() }}</span
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
          <!-- <div class="request-role">
            <button @click="requestHandle" v-if="!hasRequested">
              Request To Upgrade to MEMBER
            </button>
            <div
              class="status"
              v-if="hasRequested && roleRequest?.requestStatus == RoleRequestStatus.PENDING"
            >
              {{ roleRequest?.requestStatus }}
            </div>
            <div
              class="status"
              v-else-if="hasRequested && roleRequest?.requestStatus == RoleRequestStatus.ACCEPTED"
            >
              You are a MEMBER NOW.
            </div>
            <div
              class="status"
              v-else-if="hasRequested && roleRequest?.requestStatus == RoleRequestStatus.REJECTED"
            >
              Your request has been rejected.
            </div>
          </div> -->
          <div class="request-role mt-2 p-4 bg-white max-w-md ml-auto text-center">
            <!-- Default / Not Requested -->
            <button
              v-if="
                !hasRequested &&
                !user?.roles.includes(UserRoles.ROLE_ADMIN) &&
                !user?.roles.includes(UserRoles.ROLE_MEMBER)
              "
              @click="requestHandle"
              class="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all"
            >
              Request to Upgrade to MEMBER
            </button>

            <!-- Pending -->
            <div
              v-else-if="roleRequest?.requestStatus === RoleRequestStatus.PENDING"
              class="status inline-flex items-center justify-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl font-semibold"
            >
              <span class="mr-2 animate-pulse w-2 h-2 bg-yellow-500 rounded-full"></span>
              Pending Approval
            </div>

            <!-- Accepted -->
            <div
              v-else-if="roleRequest?.requestStatus === RoleRequestStatus.ACCEPTED"
              class="status flex flex-col items-center justify-center space-y-2"
            >
              <div class="flex items-center space-x-2 text-green-700 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>You are now a MEMBER!</span>
              </div>
              <p class="text-sm text-gray-500">Enjoy posting and engaging with others 🎉</p>
            </div>

            <!-- Rejected -->
            <div
              v-else-if="roleRequest?.requestStatus === RoleRequestStatus.REJECTED"
              class="status flex flex-col items-center justify-center text-red-700 bg-red-50 px-4 py-2 rounded-xl font-semibold"
            >
              <div>Your request has been rejected.</div>
              <p class="text-sm text-gray-500 mt-1">You can try again later.</p>
            </div>
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
