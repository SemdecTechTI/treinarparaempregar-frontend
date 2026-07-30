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

  // Páginas exclusivas do admin (ex.: usuários e perfis)
  if (to.meta.adminOnly && !auth.isAdmin) {
    return navigateTo('/admin')
  }

  // Páginas declaram o módulo via definePageMeta({ adminModule: '...' });
  // admin sempre passa, demais staff precisam da permissão no perfil.
  const module = to.meta.adminModule as string | undefined
  if (module && !auth.hasModule(module)) {
    return navigateTo('/admin')
  }
})
