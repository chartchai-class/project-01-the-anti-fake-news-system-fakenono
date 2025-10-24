<script setup lang="ts">
import MemberRequestCard from '@/components/MemberRequestCard.vue'
import RoleRequestService from '@/services/RoleRequestService'
import { RoleRequestStatus, type RoleRequest } from '@/types'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

const requests = ref<RoleRequest[]>([])
function fetchMemberRequests(status: RoleRequestStatus) {
  RoleRequestService.getRoleRequests(status).then((response) => {
    requests.value = response.data
  })
}

onMounted(() => {
  fetchMemberRequests(RoleRequestStatus.PENDING)
})

const toast = useToast()
function handleApprove(requestId: number) {
  RoleRequestService.approveRoleRequest(requestId).then(() => {
    fetchMemberRequests(RoleRequestStatus.PENDING)
    toast.success('The member request has been approved!')
  })
}

function handleReject(requestId: number) {
  RoleRequestService.rejectRoleRequest(requestId).then(() => {
    fetchMemberRequests(RoleRequestStatus.PENDING)
    toast.success('The member request has been rejected!')
  })
}
</script>

<template>
  <div class="flex flex-col mx-auto w-[90%]">
    <div v-if="requests.length == 0 || requests == null" class="text-center my-8">
      <p class="text-lg font-semibold">No pending member requests.</p>
    </div>
    <MemberRequestCard
      v-for="request in requests"
      :key="request.id"
      :request="request"
      class="mx-auto"
      @approve="handleApprove"
      @reject="handleReject"
    />
  </div>
</template>
