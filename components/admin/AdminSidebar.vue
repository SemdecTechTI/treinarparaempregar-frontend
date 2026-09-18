<template>
  <!-- Backdrop (só mobile, quando aberto) -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/50 z-[70] lg:hidden"
      @click="close"
    />
  </Teleport>

  <aside
    class="fixed inset-y-0 left-0 z-[80] w-64 bg-[#1a2d4a] text-white flex flex-col shrink-0 min-h-0 transform transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 lg:transition-none"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="p-6 border-b border-white/10 flex items-start justify-between gap-2">
      <div>
        <AppLogo variant="white" to="/admin" link-class="mb-3" />
        <p class="text-xs text-gray-400">Painel Administrativo</p>
      </div>
      <!-- Fechar (só mobile) -->
      <button
        type="button"
        class="lg:hidden -mr-2 -mt-1 p-2 text-gray-300 hover:text-white"
        aria-label="Fechar menu"
        @click="close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <NuxtLink to="/admin" class="admin-nav-link" :class="navClass('/admin', true)">Dashboard</NuxtLink>
      <template v-for="link in navLinks" :key="link.to">
        <NuxtLink v-if="auth.hasModule(link.module)" :to="link.to" class="admin-nav-link" :class="navClass(link.to)">{{ link.label }}</NuxtLink>
      </template>
      <NuxtLink v-if="auth.isAdmin" to="/admin/usuarios" class="admin-nav-link" :class="navClass('/admin/usuarios')">Usuários</NuxtLink>
      <NuxtLink v-if="auth.isAdmin" to="/admin/perfis" class="admin-nav-link" :class="navClass('/admin/perfis')">Perfis de acesso</NuxtLink>
      <NuxtLink v-if="auth.isAdmin" to="/admin/logs" class="admin-nav-link" :class="navClass('/admin/logs')">Log de atividades</NuxtLink>
    </nav>
    <div ref="userMenuRef" class="p-3 border-t border-white/10 relative">
      <!-- Menu que abre ao clicar no usuário -->
      <div
        v-if="userMenuOpen"
        class="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-card py-1 text-slate-700 overflow-hidden"
      >
        <NuxtLink to="/admin/conta" class="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 transition-colors">
          <svg class="w-4 h-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Meu perfil
        </NuxtLink>
        <NuxtLink to="/" class="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-100 transition-colors">
          <svg class="w-4 h-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          Voltar ao site
        </NuxtLink>
        <button type="button" class="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors" @click="auth.logout()">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7M13 16v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sair
        </button>
      </div>

      <!-- Cartão do usuário (iniciais + nome + e-mail) -->
      <button
        type="button"
        class="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
        :aria-expanded="userMenuOpen"
        @click="userMenuOpen = !userMenuOpen"
      >
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
          {{ initials }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium truncate">{{ auth.user?.name }}</p>
          <p class="text-xs text-gray-400 truncate">{{ auth.user?.email }}</p>
        </div>
        <svg class="w-4 h-4 text-gray-400 shrink-0 transition-transform" :class="{ 'rotate-180': userMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const open = useAdminSidebar()

const close = () => { open.value = false }

// Menu do usuário (rodapé)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const initials = computed(() => {
  const parts = (auth.user?.name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
})

function onDocClick(e: MouseEvent) {
  if (userMenuOpen.value && userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

// Fecha o drawer e o menu do usuário ao navegar
watch(() => route.fullPath, () => {
  close()
  userMenuOpen.value = false
})

// module = chave registrada em AdminModules (backend); o link só aparece
// se o perfil do usuário tiver a permissão (admin vê tudo)
const navLinks = [
  { to: '/admin/inscricoes', label: 'Inscrições', module: 'enrollments' },
  { to: '/admin/cursos', label: 'Cursos', module: 'courses' },
  { to: '/admin/trilhas', label: 'Trilhas', module: 'tracks' },
  { to: '/admin/empresas', label: 'Empresas', module: 'companies' },
  { to: '/admin/vagas-emprego', label: 'Vagas', module: 'job_vacancies' },
  { to: '/admin/parceiros', label: 'Parceiros', module: 'partners' },
  { to: '/admin/blog', label: 'Blog', module: 'blog' },
  { to: '/admin/newsletter', label: 'Newsletter', module: 'newsletter' },
  { to: '/admin/formularios', label: 'Formulários', module: 'forms' },
  { to: '/admin/campos-personalizados', label: 'Campos globais', module: 'custom_fields' },
  { to: '/admin/cidadaos', label: 'Cidadãos', module: 'citizens' },
]

const activeNavClass = 'bg-white/10'

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

function isNavActive(basePath: string, exact = false) {
  const current = normalizePath(route.path)
  const base = normalizePath(basePath)

  if (exact) {
    return current === base
  }

  return current === base || current.startsWith(`${base}/`)
}

function navClass(basePath: string, exact = false) {
  return isNavActive(basePath, exact) ? activeNavClass : ''
}

onMounted(() => {
  if (!auth.initialized) auth.fetchUser()
})
</script>

<style scoped>
.admin-nav-link {
  @apply block px-3 py-2 rounded text-sm hover:bg-white/10 transition-colors;
}
</style>
