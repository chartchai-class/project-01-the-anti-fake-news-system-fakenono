import type { UpdateUser } from '@/types'
import apiClient from './AxiosClient'

export default {
  getUserById(userId: number) {
    return apiClient.get('/user/' + userId)
  },
  UpdateUser(userId: number, updateDTO: UpdateUser) {
    return apiClient.put('/user/' + userId, updateDTO)
  },
}
