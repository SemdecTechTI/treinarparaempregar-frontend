export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.initialized) {
    await auth.fetchUser()
  }

  if (!auth.isLoggedIn) return

  return navigateTo(auth.isStaff ? '/admin' : '/conta')
})
