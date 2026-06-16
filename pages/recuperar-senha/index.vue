<template>
  <div class="container mx-auto px-4 py-12 lg:py-16 max-w-md">
    <RevealOnScroll>
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <h1 class="mb-2">Recuperar senha</h1>
        <p class="text-muted text-sm">Enviaremos um link seguro para o seu e-mail cadastrado.</p>
      </div>

      <div v-if="success" class="card-modern p-6 text-center">
        <div class="text-4xl mb-3">✉️</div>
        <p class="font-semibold text-primary mb-2">E-mail enviado!</p>
        <p class="text-sm text-muted mb-6">{{ success }}</p>
        <NuxtLink to="/entrar" class="btn w-full py-3 rounded-xl">Voltar ao login</NuxtLink>
      </div>

      <form v-else @submit.prevent="submit" class="card-modern p-6 lg:p-8 space-y-5">
        <div>
          <label class="form-label">Email cadastrado</label>
          <input v-model="email" type="email" required class="input-modern" placeholder="seu@email.com" />
        </div>
        <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{{ error }}</p>
        <button type="submit" class="btn w-full py-3.5 rounded-xl" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar link de recuperação' }}
        </button>
        <p class="text-sm text-center text-muted">
          <NuxtLink to="/entrar" class="text-accent font-semibold">Voltar ao login</NuxtLink>
        </p>
      </form>
    </RevealOnScroll>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const data = await useApiPublic<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    success.value = data.message
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível enviar o e-mail. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
