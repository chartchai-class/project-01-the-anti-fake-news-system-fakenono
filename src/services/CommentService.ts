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
  getComments() {
    return apiClient.get('/db.json')
  },
  getCommentsByNewsId(id: number, perPage: number, page: number) {
    return apiClient.get('/comments-by-news-id/' + id + '?limit=' + perPage + '&page=' + page)
  },
}
