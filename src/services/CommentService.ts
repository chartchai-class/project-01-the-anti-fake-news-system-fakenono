import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BACKEND_URL
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
      username: 'admin',
      password: 'admin',
    })
  },
  deleteComment(commentId: number) {
    return apiClient.delete('/delete-comments/' + commentId)
  },
}
