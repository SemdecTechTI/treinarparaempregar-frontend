<template>
  <div class="container mx-auto px-4 py-12 lg:py-16 max-w-md">
    <RevealOnScroll>
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <h2 class="mb-2">Bem-vindo de volta</h2>
        <p class="text-muted text-sm">Entre na sua conta para acessar os cursos</p>
      </div>

      <form @submit.prevent="submit" class="card-modern p-6 lg:p-8 space-y-5">
        <div>
          <label class="form-label">Email</label>
          <input v-model="email" type="email" required class="input-modern" placeholder="seu@email.com" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="form-label mb-0">Senha</label>
            <NuxtLink to="/recuperar-senha" class="text-xs text-accent font-semibold hover:underline">
              Esqueci minha senha
            </NuxtLink>
          </div>
          <input v-model="password" type="password" required class="input-modern" placeholder="••••••••" />
        </div>
        <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{{ error }}</p>
        <button type="submit" class="btn w-full py-3.5 rounded-xl" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        <p class="text-sm text-center text-muted pt-2">
          Não tem conta?
          <NuxtLink to="/cadastrar" class="text-accent font-semibold">Cadastre-se grátis</NuxtLink>
        </p>
      </form>
    </RevealOnScroll>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

usePageSeo({
  title: 'Entrar',
  description: 'Acesse sua conta no Treinar para Empregar.',
  path: '/entrar',
  noindex: true,
})

const route = useRoute()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value, route.query.origem as string)
    const redirect = route.query.redirect as string
    if (auth.isStaff && !redirect) {
      await navigateTo('/admin')
    } else {
      await navigateTo(redirect || '/conta')
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Email ou senha inválidos.'
  } finally {
    loading.value = false
  }
}
</script>
