import apiClient from '@/services/AxiosClient'

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
  deleteNews(id: number) {
    return apiClient.delete(`/news/${id}`)
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
