import axios from 'axios'

const apiClient = axios.create({
  baseURL: '',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getNews() {
    return apiClient.get('/news')
  },
  getNewsById(id: number) {
    return apiClient.get(`/news/${id}`)
  },
}
