<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = authStore.user
const image_url =
  user?.imageUrl ??
  'https://images.nightcafe.studio/users/ZcDYVAlvjNbsAHbwNhUFxdU0rXs2/uploads/m7XuV1i6egth4ISiD240.jpeg?tr=w-1600,c-at_max'
</script>

<template>
  <div>
    <div class="user-detail">
      <div class="profile-image"></div>
      <div class="detail">
        <div>
          <div class="name">{{ user?.name }} {{ user?.roles }}</div>
        </div>
        <div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    <div class="posted-news"></div>
  </div>
</template>
