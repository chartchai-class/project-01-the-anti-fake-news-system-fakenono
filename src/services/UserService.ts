import type { UpdateUser } from '@/types'
import apiClient from './AxiosClient'

export default {
  getUserById(userId: number) {
    return apiClient.get('/user/' + userId)
  },
  UpdateUser(userId: number, updateDTO: UpdateUser) {
    return apiClient.put('/user/' + userId, updateDTO)
  },
  UpdateImage(userId: number, updateImage) {
    return apiClient.patch(`/user/${userId}/updateImage`, updateImage)
  },
  getAllUsers() {
    return apiClient.get('/users')
  },
}
