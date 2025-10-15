import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getNews(params) {
    return apiClient.get('/news', { params })
  },
  getNewsById(id: number) {
    return apiClient.get(`/news/${id}`)
  },
  postNews(news: any) {
    return apiClient.post('/news', news)
  },
}

// const apiClient = axios.create({
//   baseURL: 'https://waiyanmoelwin.github.io/se331-midterm-project-db',
//   withCredentials: false,
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
// })

// export default {
//   getNews() {
//     return apiClient.get('/db.json')
//   },
// }
