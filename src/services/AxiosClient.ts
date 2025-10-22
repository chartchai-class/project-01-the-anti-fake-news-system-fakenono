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
      request.headers['Authorization'] = token
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
