import { homeForUser, safeInternalPath } from '~/utils/navigation'

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

  const route = router.currentRoute.value
  if (auth.isLoggedIn && isGuestRoute(route.path)) {
    const redirect = safeInternalPath(route.query.redirect)
    await nuxtApp.runWithContext(() => navigateTo(redirect || homeForUser(!!auth.isStaff)))
  }
})
