import apiClient from './AxiosClient'

export default {
  getUserById(userId: number) {
    return apiClient.get('/user/' + userId)
  },
}
