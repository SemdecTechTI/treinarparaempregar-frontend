<template>
  <div class="container mx-auto px-4 py-10 lg:py-12 max-w-6xl">
    <div class="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 sm:p-8 text-white shadow-soft flex flex-col sm:flex-row sm:items-center gap-5">
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-2xl font-bold shrink-0">
        {{ initials }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-white/80 text-sm font-medium mb-1">Minha conta</p>
        <h1 class="text-2xl sm:text-3xl font-bold truncate text-white">{{ displayName }}</h1>
        <p class="text-white/85 text-sm mt-1 truncate">{{ auth.user?.email }}</p>
      </div>
      <NuxtLink
        to="/cursos"
        class="btn-ghost text-sm py-2.5 px-4 rounded-xl shrink-0 self-start sm:self-center"
      >
        Explorar cursos
      </NuxtLink>
    </div>

    <nav class="mt-6 mb-8 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Seções da conta">
      <NuxtLink
        v-for="item in tabs"
        :key="item.to"
        :to="item.to"
        class="account-tab"
        :class="isActive(item.to) ? 'account-tab-active' : 'account-tab-idle'"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { loadTracks } from '~/utils/tracks'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const route = useRoute()

const tabs = [
  { to: '/conta', label: 'Visão geral' },
  { to: '/conta/perfil', label: 'Perfil' },
  { to: '/conta/seguranca', label: 'Senha e e-mail' },
  { to: '/conta/cursos', label: 'Meus cursos' },
]

const displayName = computed(() => {
  const social = auth.user?.social_name?.trim()
  return social || auth.user?.name || 'Cidadão'
})

const initials = computed(() => {
  const parts = (displayName.value || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
})

function isActive(to: string) {
  if (to === '/conta') return route.path === '/conta'
  return route.path === to || route.path.startsWith(`${to}/`)
}

onMounted(() => {
  loadTracks()
})
</script>

<style scoped>
.account-tab {
  @apply inline-flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors no-underline;
}
.account-tab-idle {
  @apply bg-white text-text border-gray-200 hover:border-primary/40 hover:text-primary;
}
.account-tab-active {
  @apply bg-primary text-white border-primary shadow-soft;
}
</style>
