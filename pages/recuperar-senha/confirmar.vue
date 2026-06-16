<template>
  <div class="container mx-auto px-4 py-12 lg:py-16 max-w-md">
    <RevealOnScroll>
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-h5 to-h6 flex items-center justify-center shadow-glow">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h1 class="mb-2">Nova senha</h1>
        <p class="text-muted text-sm">Digite e confirme sua nova senha de acesso.</p>
      </div>

      <div v-if="!token || !email" class="card-modern p-6 text-center">
        <p class="text-red-600 text-sm">Link inválido. Solicite uma nova recuperação de senha.</p>
        <NuxtLink to="/recuperar-senha" class="btn mt-4 inline-flex">Recuperar senha</NuxtLink>
      </div>

      <div v-else-if="done" class="card-modern p-6 text-center">
        <div class="text-4xl mb-3">✅</div>
        <p class="font-semibold text-primary mb-2">Senha alterada!</p>
        <p class="text-sm text-muted mb-6">{{ done }}</p>
        <NuxtLink to="/entrar" class="btn w-full py-3 rounded-xl">Fazer login</NuxtLink>
      </div>

      <form v-else @submit.prevent="submit" class="card-modern p-6 lg:p-8 space-y-5">
        <div class="bg-surface rounded-xl px-4 py-3 text-sm text-muted">
          Redefinindo senha para <strong class="text-text">{{ email }}</strong>
        </div>
        <div>
          <label class="form-label">Nova senha</label>
          <input v-model="password" type="password" required minlength="8" class="input-modern" placeholder="Mínimo 8 caracteres" />
        </div>
        <div>
          <label class="form-label">Confirmar nova senha</label>
          <input v-model="passwordConfirmation" type="password" required class="input-modern" />
        </div>
        <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{{ error }}</p>
        <button type="submit" class="btn w-full py-3.5 rounded-xl" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Salvar nova senha' }}
        </button>
      </form>
    </RevealOnScroll>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const route = useRoute()
const token = computed(() => route.query.token as string)
const email = computed(() => route.query.email as string)

const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')
const done = ref('')

async function submit() {
  if (password.value !== passwordConfirmation.value) {
    error.value = 'As senhas não coincidem.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const data = await useApiPublic<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
      },
    })
    done.value = data.message
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível redefinir a senha. O link pode ter expirado.'
  } finally {
    loading.value = false
  }
}
</script>
