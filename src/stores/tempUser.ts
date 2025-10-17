/**
 * Temporary Store for implementing authorization
 */

import type { User, UserState } from '@/types'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({ user: null }),
  actions: {
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearUser() {
      this.user = null
    },
    reloadUserFromStorages() {
      const userData = localStorage.getItem('user')
      if (userData) {
        this.user = JSON.parse(userData)
      }
    },
  },
})
