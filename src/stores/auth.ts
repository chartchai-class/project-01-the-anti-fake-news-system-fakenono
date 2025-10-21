import { UserRoles, type User } from '@/types'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { defineStore } from 'pinia'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  getters: {
    currentUserName(): string {
      return this.user?.name || ''
    },
    isAdmin(): boolean {
      return this.user?.roles.includes(UserRoles.ROLE_ADMIN) || false
    },
    authorizationHeader(): string {
      return `Bearer ${this.token}`
    },
  },
  actions: {
    login(email: string, password: string) {
      return apiClient
        .post('/api/v1/auth/authenticate', {
          username: email,
          password: password,
        })
        .then((response) => {
          this.token = response.data.access_token
          this.user = response.data.user
          localStorage.setItem('access_token', this.token as string)
          localStorage.setItem('user', JSON.stringify(this.user))
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          return response
        })
    },
    logout() {
      console.log('log out')
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
    reload(token: string, user: User) {
      this.token = token
      this.user = user
    },
    signUp(firstname: string, lastname: string, username: string, email: string, password: string) {
      return apiClient
        .post('/api/v1/auth/register', {
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: password,
        })
        .then((response) => {
          this.token = response.data.access_token
          this.user = response.data.organizer
          localStorage.setItem('access_token', this.token as string)
          localStorage.setItem('user', JSON.stringify(this.user))
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          return response
        })
    },
  },
})
