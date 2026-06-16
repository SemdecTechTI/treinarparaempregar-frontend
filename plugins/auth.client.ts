const GUEST_ROUTE_PREFIXES = ['/entrar', '/cadastrar', '/recuperar-senha']

function isGuestRoute(path: string) {
  return GUEST_ROUTE_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`))
}

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  await auth.fetchUser()

  const route = useRouter().currentRoute.value
  if (auth.isLoggedIn && isGuestRoute(route.path)) {
    await navigateTo(auth.isStaff ? '/admin' : '/conta')
  }
})
