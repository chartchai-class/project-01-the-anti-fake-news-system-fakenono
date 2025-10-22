import apiClient from '@/services/AxiosClient'
import type { Comment, User, Vote } from '@/types'

export default {
  postVoteAndComment(comment: Comment, vote: Vote, newsId: number, user: User) {
    return apiClient.post('/comment-vote/' + newsId, {
      comment: comment,
      vote: vote,
      userId: user.id,
    })
  },
  getVote(newsId: number) {
    return apiClient.get('/votes-by-news-id/' + newsId)
  },
  getVoteByUserId(userId: number) {
    return apiClient.get('/vote-count-by-user-id/' + userId)
  },
}
