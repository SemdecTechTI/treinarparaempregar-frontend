<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300"
    :class="headerClass"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <AppLogo :variant="lightNav ? 'white' : 'light'" />

        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="lightNav ? 'nav-link-hero' : 'nav-link-light'"
          >
            {{ link.label }}
          </NuxtLink>

          <div class="relative group ml-2">
            <button
              type="button"
              class="nav-link flex items-center gap-1"
              :class="lightNav ? 'nav-link-hero' : 'nav-link-light'"
            >
              Trilhas
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div class="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl py-2 shadow-card border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <NuxtLink
                v-for="t in trilhas"
                :key="t.to"
                :to="t.to"
                class="nav-dropdown-link"
              >
                <span>{{ t.icon }}</span> {{ t.label }}
              </NuxtLink>
            </div>
          </div>
        </nav>

        <div class="flex items-center gap-2">
          <a
            :href="SOCIAL_FACEBOOK_URL"
            target="_blank"
            rel="noopener"
            class="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg transition-all"
            :class="lightNav ? 'text-white hover:bg-white/20' : 'text-muted hover:text-primary hover:bg-primary/10'"
            aria-label="Facebook"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a
            :href="SOCIAL_INSTAGRAM_URL"
            target="_blank"
            rel="noopener"
            class="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg transition-all"
            :class="lightNav ? 'text-white hover:bg-white/20' : 'text-muted hover:text-primary hover:bg-primary/10'"
            aria-label="Instagram"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>

          <template v-if="auth.isLoggedIn">
            <div class="relative group">
              <button
                type="button"
                class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all"
                :class="lightNav ? 'hover:bg-white/15' : 'hover:bg-primary/10'"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {{ auth.user?.name?.charAt(0) }}
                </div>
                <span
                  class="text-sm font-medium hidden sm:block"
                  :class="lightNav ? 'text-white' : 'text-primary'"
                >
                  {{ auth.user?.name?.split(' ')[0] }}
                </span>
                <svg
                  class="w-4 h-4 hidden sm:block"
                  :class="lightNav ? 'text-white/90' : 'text-muted'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl py-2 shadow-card border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <NuxtLink to="/conta" class="nav-dropdown-link">Minha Conta</NuxtLink>
                <NuxtLink to="/acervo" class="nav-dropdown-link">Acervo</NuxtLink>
                <button type="button" @click="auth.logout()" class="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg">
                  Sair
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink
              to="/entrar"
              class="hidden sm:block text-sm font-medium px-3 py-2 rounded-lg transition-colors nav-link"
              :class="lightNav ? 'nav-link-hero' : 'nav-link-light'"
            >
              Entrar
            </NuxtLink>
            <NuxtLink to="/cadastrar" class="btn text-sm py-2.5 px-5 rounded-xl">Cadastrar</NuxtLink>
          </template>

          <button
            type="button"
            class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
            :class="lightNav ? 'text-white hover:bg-white/20' : 'text-primary hover:bg-primary/10'"
            @click="mobileOpen = !mobileOpen"
            aria-label="Menu"
          >
            <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="lg:hidden bg-white border-t border-gray-100 shadow-lg">
        <nav class="container mx-auto px-4 py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="link in [...navLinks, ...trilhas]"
            :key="link.to"
            :to="link.to"
            class="nav-link nav-link-light"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            v-if="auth.isLoggedIn"
            to="/acervo"
            class="nav-link nav-link-light"
            @click="mobileOpen = false"
          >
            Acervo
          </NuxtLink>
          <NuxtLink
            v-if="!auth.isLoggedIn"
            to="/entrar"
            class="nav-link nav-link-light text-accent font-semibold"
            @click="mobileOpen = false"
          >
            Entrar
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

const isHome = computed(() => route.path === '/')
const lightNav = computed(() => isHome.value && !scrolled.value)
const headerClass = computed(() => {
  if (scrolled.value) return 'bg-white/95 backdrop-blur-xl shadow-soft border-b border-gray-100/80'
  if (isHome.value) return 'bg-transparent'
  return 'bg-white/95 backdrop-blur-xl border-b border-gray-100/60'
})

const onScroll = () => { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = [
  { to: '/quem-somos', label: 'Quem somos' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/seja-parceiro', label: 'Seja parceiro' },
  { to: '/blog', label: 'Blog' },
]

const trilhas = [
  { to: '/trilhas/base', label: 'SIMM Prepara', icon: '📚' },
  { to: '/trilhas/saude', label: 'Saúde', icon: '🏥' },
  { to: '/trilhas/servicos', label: 'Serviços', icon: '💼' },
  { to: '/trilhas/tecnicos', label: 'Construção Civil', icon: '🔧' },
]
</script>
