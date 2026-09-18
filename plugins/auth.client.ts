const GUEST_ROUTE_PREFIXES = ['/entrar', '/cadastrar', '/recuperar-senha']

function isGuestRoute(path: string) {
  return GUEST_ROUTE_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`))
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  // Captura o router ANTES do await — depois do await o contexto do Nuxt
  // se perde, e chamar useRouter()/navigateTo (e o middleware que ele dispara,
  // que usa useAuthStore) fora do contexto quebra o Pinia (getActivePinia()).
  const router = useRouter()

  await auth.fetchUser()

  const path = router.currentRoute.value.path
  if (auth.isLoggedIn && isGuestRoute(path)) {
    // runWithContext restaura o contexto do Nuxt para a navegação e seus middlewares.
    await nuxtApp.runWithContext(() => navigateTo(auth.isStaff ? '/admin' : '/conta'))
  }
})
