export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.fetchUser()
  }

  if (!auth.isLoggedIn) {
    return navigateTo(`/entrar?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!auth.isStaff) {
    return navigateTo('/conta')
  }
})
