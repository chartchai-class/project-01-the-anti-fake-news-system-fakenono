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

export default {
  postVoteAndComment(comment: Comment, vote: Vote, newsId: number) {
    return apiClient.post('/comment-vote/' + newsId, {
      comment: comment,
      vote: vote,
    })
  },
}
