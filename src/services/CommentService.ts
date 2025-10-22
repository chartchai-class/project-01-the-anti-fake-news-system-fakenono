import apiClient from '@/services/AxiosClient'

export default {
  getComments() {
    return apiClient.get('/db.json')
  },
  getCommentsByNewsId(id: number, perPage: number, page: number) {
    return apiClient.get('/comments-by-news-id/' + id + '?limit=' + perPage + '&page=' + page)
  },
  getNewsById(id: number) {
    return apiClient.get('/news/' + id)
  },
  loginTemp() {
    return apiClient.post('/api/v1/auth/authenticate', {
      username: 'user',
      password: 'user',
    })
  },
  deleteComment(commentId: number) {
    return apiClient.delete('/comment-vote/' + commentId)
  },
}
