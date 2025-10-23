import apiClient from './AxiosClient'

export default {
  getDashboardStats() {
    return apiClient.get('/dashboard')
  },
}
