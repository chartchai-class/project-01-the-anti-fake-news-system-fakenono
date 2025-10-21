<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')
if (token && user) {
  authStore.reload(token, JSON.parse(user))
} else {
  authStore.logout()
}
</script>

<template>
  <header>
    <h1 class="text-4xl font-bold p-4 text-center bg-black sticky top-0">
      <span class="text-white">FakeNoNo</span>
    </h1>
  </header>

  <RouterView />
</template>

<style scoped></style>
