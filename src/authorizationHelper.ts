//import { useUserStore } from './stores/tempUser'
import { useAuthStore } from './stores/auth'
import { UserRoles } from './types'

export const isAuthorize = (userRole: UserRoles[]) => {
  const userStore = useAuthStore()
  if (!userStore.user) {
    return false
  }
  return userStore.user.roles.some((role) => userRole.includes(role))
}
