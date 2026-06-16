export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.initialized) {
    await auth.fetchUser()
  }
  if (!auth.isLoggedIn) {
    // No SSR, o cliente revalida com cookies — evita redirect falso no F5
    if (import.meta.server) return

    const route = useRoute()
    return navigateTo(`/entrar?redirect=${encodeURIComponent(route.fullPath)}`)
  }
})
