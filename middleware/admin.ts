export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.fetchUser()
  }

  if (!auth.isLoggedIn) {
    // Cookie Sanctum está no domínio da API — no SSR o Node do front não vê a sessão.
    // Sem este return, o F5 em /admin/cursos manda para /entrar no HTML do servidor.
    if (import.meta.server) return

    return navigateTo(`/entrar?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!auth.isStaff) {
    return navigateTo('/conta')
  }

  if (to.meta.adminOnly && !auth.isAdmin) {
    return navigateTo('/admin')
  }

  const module = to.meta.adminModule as string | undefined
  if (module && !auth.hasModule(module)) {
    return navigateTo('/admin')
  }
})
