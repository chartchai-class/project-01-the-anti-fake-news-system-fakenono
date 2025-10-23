import apiClient from './AxiosClient'

export default {
  postRoleRequest(userId: number) {
    return apiClient.post('/role-request/' + userId)
  },
  getRoleRequest(userId: number) {
    return apiClient.get('/role-request/' + userId)
  },
}
