import axios from 'axios'

// const apiClient = axios.create({
//   baseURL: 'https://my-json-server.typicode.com/WaiYanMoeLwin/se331-midterm-project-db',
//   withCredentials: false,
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
// })

// export default {
//   getNews() {
//     return apiClient.get('/news')
//   },
//   getNewsById(id: number) {
//     return apiClient.get(`/news/${id}`)
//   },
// }
const BASE_URL = 'http://localhost:8080'
const apiClient = axios.create({
  baseURL: 'https://waiyanmoelwin.github.io/se331-midterm-project-db',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getNews() {
    return apiClient.get('/db.json')
  },
  getNewsById(id: number) {
    return apiClient.get('/news/' + id)
  },
}
