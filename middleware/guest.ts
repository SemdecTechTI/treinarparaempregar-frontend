import { homeForUser, safeInternalPath } from '~/utils/navigation'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) {
    await auth.fetchUser()
  }

  if (!auth.isLoggedIn) return

  const redirect = safeInternalPath(to.query.redirect)
  return navigateTo(redirect || homeForUser(!!auth.isStaff))
})
