import type { Comment, Vote } from '@/types'
import axios from 'axios'
const BASE_URL = 'http://localhost:8080'
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('access_token')
    console.log('Token', token)
    if (token) {
      request.headers['Authorization'] = 'Bearer ' + token
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default {
  postVoteAndComment(comment: Comment, vote: Vote, newsId: number) {
    return apiClient.post('/comment-vote/' + newsId, {
      comment: comment,
      vote: vote,
    })
  },
}
