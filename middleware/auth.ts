export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) {
    await auth.fetchUser()
  }
  if (!auth.isLoggedIn) {
    // No SSR, o cliente revalida com cookies — evita redirect falso no F5
    if (import.meta.server) return

    // usa o parâmetro `to` (síncrono) em vez de useRoute() pós-await
    return navigateTo(`/entrar?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
