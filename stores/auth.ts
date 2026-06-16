export interface User {
  id: number
  name: string
  email: string
  cpf?: string
  role: string
  phone?: string
  cep?: string
  address?: string
  number?: string
  neighborhood?: string
  city?: string
  state?: string
  complement?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const initialized = ref(false)
  let fetchPromise: Promise<void> | null = null

  const isLoggedIn = computed(() => user.value !== null)
  const isStaff = computed(() => user.value && ['admin', 'atendente'].includes(user.value.role))
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function fetchUser() {
    if (fetchPromise) return fetchPromise

    fetchPromise = (async () => {
      loading.value = true
      try {
        if (import.meta.client) {
          await ensureSanctumCsrf()
        }
        const data = await useApi<{ user: User | null }>('/auth/me')
        user.value = data.user ?? null
      } catch {
        user.value = null
      } finally {
        loading.value = false
        initialized.value = true
        fetchPromise = null
      }
    })()

    return fetchPromise
  }

  async function login(email: string, password: string, origem?: string) {
    await ensureSanctumCsrf()
    const data = await useApi<{ user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password, origem },
    })
    user.value = data.user
    initialized.value = true
    return data.user
  }

  async function register(payload: Record<string, unknown>) {
    await ensureSanctumCsrf()
    const data = await useApi<{ user: User }>('/auth/register', {
      method: 'POST',
      body: payload,
    })
    user.value = data.user
    initialized.value = true
    return data.user
  }

  async function logout() {
    await useApi('/auth/logout', { method: 'POST' })
    user.value = null
    initialized.value = true
    await navigateTo('/')
  }

  return {
    user,
    loading,
    initialized,
    isLoggedIn,
    isStaff,
    isAdmin,
    fetchUser,
    login,
    register,
    logout,
  }
})
