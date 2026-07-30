<template>
  <aside class="w-64 bg-[#1a2d4a] text-white flex flex-col shrink-0 min-h-0">
    <div class="p-6 border-b border-white/10">
      <AppLogo variant="white" to="/admin" link-class="mb-3" />
      <p class="text-xs text-gray-400">Painel Administrativo</p>
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
    <div class="p-4 border-t border-white/10 space-y-3">
      <p class="text-xs text-gray-400 truncate">{{ auth.user?.name }}</p>
      <button type="button" class="text-xs text-red-300 hover:text-red-200" @click="auth.logout()">Sair</button>
      <NuxtLink to="/" class="text-xs text-gray-400 hover:text-white block">← Voltar ao site</NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

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
