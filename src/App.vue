<script setup lang="ts">
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  PresentationChartBarIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/vue/16/solid'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { isAuthorize } from './authorizationHelper'
import UserService from './services/UserService'
import { useAuthStore } from './stores/auth'
import { UserRoles, type User } from './types'

const authStore = useAuthStore()

const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')
const isLoggedIn = computed(() => {
  return isAuthorize([UserRoles.ROLE_READER])
})
const isAdmin = computed(() => {
  return isAuthorize([UserRoles.ROLE_ADMIN])
})
const isOpen = ref<boolean>()
const dropdownRef = ref(null)
const userObj = ref<User>()
const emptyImageUrl = import.meta.env.VITE_EMPTY_IMAGE_URL

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}
const authUserRef = storeToRefs(authStore)
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  watch(
    authUserRef.user,
    () => {
      if (authStore.user) {
        UserService.getUserById(authStore.user.id).then((response) => {
          userObj.value = response.data
        })
      }
    },
    { immediate: true },
  )
  watch(
    () => authUserRef.user.value?.imageUrl,
    (newImage) => {
      if (userObj.value) userObj.value.imageUrl = newImage
    },
  )
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
if (token && user) {
  authStore.reload(token, JSON.parse(user))
  console.log('Authstore reload')
} else {
  authStore.logout()
}

function logout() {
  authStore.logout()
  isOpen.value = false
}
</script>

<template>
  <header class="bg-black sticky top-0 flex items-center justify-between px-6 pr-2 py-4 z-50">
    <!-- <div class="w-1/3"></div> -->
    <RouterLink to="/" class="text-4xl font-bold text-white text-center w-auto mr-auto"
      >FakeNoNo</RouterLink
    >
    <div class="w-1/3 flex justify-end">
      <router-link to="/login" v-if="!isLoggedIn">
        <button class="py-2 md:mr-3 text-white rounded transition">
          <ArrowLeftEndOnRectangleIcon class="w-6 h-6 inline" /> Login
        </button>
      </router-link>
      <router-link to="/registration" v-if="!isLoggedIn">
        <button class="py-2 text-white rounded transition">
          <UserPlusIcon class="h-6 w-6 inline" /> Register
        </button>
      </router-link>

      <div class="drop-down relative" ref="dropdownRef">
        <img
          :src="userObj?.imageUrl || emptyImageUrl"
          @click="isOpen = !isOpen"
          @focusout="isOpen = false"
          class="w-[40px] h-[40px] rounded-full cursor-pointer"
          v-if="isLoggedIn"
        />
        <div
          v-if="isOpen"
          class="absolute right-0 mt-[3%] w-44 bg-white rounded-lg shadow-sm border"
          @click.prevent="isOpen = false"
        >
          <ul class="py-2 px-2 text-sm text-gray-700">
            <li class="mb-2">
              <RouterLink :to="{ name: 'user-detail-view' }"
                ><UserIcon class="h-6 w-6 inline" /> Profile</RouterLink
              >
            </li>
            <li v-if="isAdmin" class="mb-2">
              <RouterLink :to="{ name: 'admin-dashboard-view' }"
                ><PresentationChartBarIcon class="h-6 w-6 inline" /> Dashboard</RouterLink
              >
            </li>
            <li class="mb-2">
              <button @click.prevent="logout">
                <ArrowRightStartOnRectangleIcon class="h-6 w-6 inline" />Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
