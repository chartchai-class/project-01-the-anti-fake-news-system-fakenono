import { useUserStore } from './stores/tempUser'
import { UserRoles } from './types'

export const isAuthorize = (userRole: UserRoles[]) => {
  const userStore = useUserStore()
  if (!userStore.user) {
    return false
  }
  return userStore.user.roles.some((role) => userRole.includes(role))
}
