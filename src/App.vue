<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')
if (token && user) {
  authStore.reload(token, JSON.parse(user))
  console.log('Authstore reload')
} else {
  authStore.logout()
}
</script>

<template>
  <header class="bg-black sticky top-0 flex items-center justify-between px-6 py-4 z-50">
    <div class="w-1/3"></div>
    <h1 class="text-4xl font-bold text-white text-center w-1/3">FakeNoNo</h1>
    <div class="w-1/3 flex justify-end space-x-4">
      <router-link to="/login">
        <button class="px-4 py-2 bg-white text-black rounded hover:bg-green-200 transition">
          Login
        </button>
      </router-link>
      <router-link to="/registration">
        <button class="px-4 py-2 bg-white text-black rounded hover:bg-green-200 transition">
          Register
        </button>
      </router-link>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
