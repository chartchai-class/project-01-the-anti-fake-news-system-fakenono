<script setup lang="ts">
import UserService from '@/services/UserService'
import type { RoleRequest, User } from '@/types'
import { defineProps, onMounted, ref } from 'vue'

const props = defineProps<{
  request: RoleRequest
}>()

const user = ref<User>()
onMounted(() => {
  UserService.getUserById(props.request.userId).then((response) => {
    user.value = response.data
  })
})
const emit = defineEmits(['approve', 'reject'])
function handleApprove() {
  emit('approve', props.request.id)
}
function handleReject() {
  emit('reject', props.request.id)
}
</script>

<template>
  <div v-bind="$attrs" class="flex flex-row border rounded-lg p-4 mb-4 w-[80%] justify-self-center">
    <img
      v-if="user?.imageUrl"
      :src="user.imageUrl"
      alt="User Avatar"
      class="w-12 h-12 rounded-full mr-4"
    />
    <div class="flex flex-col w-full">
      <h3 class="text-lg font-semibold">{{ user?.name }} {{ user?.surname }}</h3>
      <p class="text-sm text-gray-600">{{ user?.email }}</p>
      <p class="text-sm text-gray-600">
        Requested at {{ new Date(props.request.requestedDate).toLocaleString() }}
      </p>
    </div>
    <div class="flex flex-col justify-items-center gap-2">
      <button
        @click="handleApprove"
        class="bg-[#00822b] text-white rounded-lg px-4 py-2 hover:shadow-md hover:scale-105 font-semibold"
      >
        Approve
      </button>
      <button
        @click="handleReject"
        class="bg-[#920000] text-white rounded-lg px-4 py-2 mt-2 hover:shadow-md hover:scale-105 font-semibold"
      >
        Reject
      </button>
    </div>
  </div>
</template>
