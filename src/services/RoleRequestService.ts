import type { RoleRequestStatus } from '@/types'
import apiClient from './AxiosClient'

export default {
  postRoleRequest(userId: number) {
    return apiClient.post('/role-request/' + userId)
  },
  getRoleRequest(userId: number) {
    return apiClient.get('/role-request/' + userId)
  },
  getRoleRequests(status: RoleRequestStatus) {
    return apiClient.get('/role-request/status/' + status)
  },
  approveRoleRequest(requestId: number) {
    return apiClient.post('/role-request/approve?requestId=' + requestId)
  },
  rejectRoleRequest(requestId: number) {
    return apiClient.post('/role-request/reject?requestId=' + requestId)
  },
}
