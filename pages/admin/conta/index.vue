<template>
  <div class="max-w-4xl mx-auto">
    <!-- Cabeçalho com identidade do usuário -->
    <div class="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 sm:p-8 text-white shadow-soft flex items-center gap-5">
      <div class="w-20 h-20 rounded-2xl bg-white/15 ring-2 ring-white/30 flex items-center justify-center text-2xl font-bold shrink-0">
        {{ initials }}
      </div>
      <div class="min-w-0">
        <h1 class="text-2xl font-bold truncate text-white">{{ auth.user?.name }}</h1>
        <span class="inline-block mt-2 text-xs font-semibold bg-white/20 rounded-full px-3 py-1">{{ roleLabel }}</span>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mt-6">
      <!-- Dados da conta -->
      <section class="account-card">
        <div class="account-head">
          <div class="account-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
          <div>
            <h2 class="account-title">Dados da conta</h2>
            <p class="account-sub">Atualize seu nome de exibição.</p>
          </div>
        </div>
        <form class="space-y-4" @submit.prevent="saveProfile">
          <div>
            <label class="account-label">Nome</label>
            <input v-model="profile.name" type="text" class="admin-input" required />
          </div>
          <div>
            <label class="account-label">E-mail</label>
            <input :value="auth.user?.email" type="email" class="admin-input bg-gray-50 text-muted" disabled />
            <p class="text-xs text-muted mt-1.5">Para trocar o e-mail, use o bloco “Alterar e-mail” abaixo.</p>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn text-sm py-2.5 px-5" :disabled="savingProfile">
              {{ savingProfile ? 'Salvando…' : 'Salvar' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Alterar senha -->
      <section class="account-card">
        <div class="account-head">
          <div class="account-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
          <div>
            <h2 class="account-title">Alterar senha</h2>
            <p class="account-sub">Confirme com a senha atual.</p>
          </div>
        </div>
        <form class="space-y-4" @submit.prevent="savePassword">
          <div>
            <label class="account-label">Senha atual</label>
            <input v-model="pwd.current_password" type="password" class="admin-input" autocomplete="current-password" required />
          </div>
          <div>
            <label class="account-label">Nova senha</label>
            <input v-model="pwd.password" type="password" class="admin-input" autocomplete="new-password" required />
          </div>
          <div>
            <label class="account-label">Confirmar nova senha</label>
            <input v-model="pwd.password_confirmation" type="password" class="admin-input" autocomplete="new-password" required />
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn text-sm py-2.5 px-5" :disabled="savingPwd">
              {{ savingPwd ? 'Alterando…' : 'Alterar senha' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Alterar e-mail (full width) -->
      <section class="account-card md:col-span-2">
        <div class="account-head">
          <div class="account-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
          <div>
            <h2 class="account-title">Alterar e-mail</h2>
            <p class="account-sub">Enviaremos um código de confirmação para o <strong>novo e-mail</strong>.</p>
          </div>
        </div>

        <!-- Passo 1 -->
        <form v-if="!emailStep2" class="grid sm:grid-cols-2 gap-4" @submit.prevent="requestEmailChange">
          <div>
            <label class="account-label">Novo e-mail</label>
            <input v-model="emailForm.email" type="email" class="admin-input" required />
          </div>
          <div>
            <label class="account-label">Sua senha atual</label>
            <input v-model="emailForm.current_password" type="password" class="admin-input" autocomplete="current-password" required />
          </div>
          <div class="sm:col-span-2 flex justify-end">
            <button type="submit" class="btn text-sm py-2.5 px-5" :disabled="requestingEmail">
              {{ requestingEmail ? 'Enviando…' : 'Enviar código' }}
            </button>
          </div>
        </form>

        <!-- Passo 2 -->
        <form v-else class="space-y-4" @submit.prevent="confirmEmailChange">
          <div class="flex items-start gap-3 rounded-xl bg-accent/10 text-primary p-3 text-sm">
            <svg class="w-5 h-5 shrink-0 text-accent mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p>Enviamos um código para <strong>{{ pendingEmail }}</strong>. Digite-o abaixo para confirmar a troca.</p>
          </div>
          <div class="max-w-xs">
            <label class="account-label">Código de confirmação</label>
            <input
              v-model="emailForm.code"
              type="text"
              inputmode="numeric"
              maxlength="6"
              class="admin-input tracking-[0.5em] text-center text-lg font-semibold"
              placeholder="000000"
              required
            />
          </div>
          <div class="flex flex-wrap justify-end gap-2">
            <button type="button" class="btn btn-outline text-sm py-2.5 px-5" @click="cancelEmailChange">Cancelar</button>
            <button type="submit" class="btn text-sm py-2.5 px-5" :disabled="confirmingEmail">
              {{ confirmingEmail ? 'Confirmando…' : 'Confirmar troca' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const auth = useAuthStore()
const dialog = useDialog()

const profile = reactive({ name: auth.user?.name ?? '' })
const pwd = reactive({ current_password: '', password: '', password_confirmation: '' })
const emailForm = reactive({ email: '', current_password: '', code: '' })

const savingProfile = ref(false)
const savingPwd = ref(false)
const requestingEmail = ref(false)
const confirmingEmail = ref(false)
const emailStep2 = ref(false)
const pendingEmail = ref('')

const initials = computed(() => {
  const parts = (auth.user?.name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
})

const roleLabel = computed(() => {
  const map: Record<string, string> = { admin: 'Administrador', atendente: 'Atendente', aluno: 'Cidadão' }
  return map[auth.user?.role ?? ''] ?? 'Usuário'
})

watch(() => auth.user?.name, (n) => { if (n && !profile.name) profile.name = n })

function apiError(e: any, fallback: string): string {
  const errors = e?.data?.errors
  if (errors && typeof errors === 'object') {
    const msgs = Object.values(errors).flat().filter(Boolean) as string[]
    if (msgs.length) return msgs.join('\n')
  }
  return e?.data?.message || fallback
}

async function saveProfile() {
  savingProfile.value = true
  try {
    await ensureSanctumCsrf()
    await useApi('/account/profile', { method: 'PATCH', body: { name: profile.name } })
    await auth.fetchUser()
    await dialog.toastSuccess('Dados atualizados.')
  } catch (e) {
    await dialog.error(apiError(e, 'Não foi possível salvar os dados.'))
  } finally {
    savingProfile.value = false
  }
}

async function savePassword() {
  savingPwd.value = true
  try {
    await ensureSanctumCsrf()
    await useApi('/account/password', { method: 'PUT', body: { ...pwd } })
    pwd.current_password = pwd.password = pwd.password_confirmation = ''
    await dialog.success('Senha alterada com sucesso.')
  } catch (e) {
    await dialog.error(apiError(e, 'Não foi possível alterar a senha.'))
  } finally {
    savingPwd.value = false
  }
}

async function requestEmailChange() {
  requestingEmail.value = true
  try {
    await ensureSanctumCsrf()
    const res = await useApi<{ pending_email: string }>('/account/email/request', {
      method: 'POST',
      body: { email: emailForm.email, current_password: emailForm.current_password },
    })
    pendingEmail.value = res.pending_email
    emailStep2.value = true
    emailForm.current_password = ''
  } catch (e) {
    await dialog.error(apiError(e, 'Não foi possível enviar o código.'))
  } finally {
    requestingEmail.value = false
  }
}

async function confirmEmailChange() {
  confirmingEmail.value = true
  try {
    await ensureSanctumCsrf()
    await useApi('/account/email/confirm', { method: 'POST', body: { code: emailForm.code } })
    await auth.fetchUser()
    emailStep2.value = false
    emailForm.email = emailForm.code = ''
    pendingEmail.value = ''
    await dialog.success('E-mail alterado com sucesso.')
  } catch (e) {
    await dialog.error(apiError(e, 'Não foi possível confirmar a troca.'))
  } finally {
    confirmingEmail.value = false
  }
}

function cancelEmailChange() {
  emailStep2.value = false
  emailForm.email = emailForm.code = emailForm.current_password = ''
  pendingEmail.value = ''
}
</script>

<style scoped>
.account-card {
  @apply bg-white rounded-2xl shadow-soft p-6;
}
.account-head {
  @apply flex items-start gap-3 mb-5;
}
.account-icon {
  @apply w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0;
}
.account-icon svg {
  @apply w-5 h-5;
}
.account-title {
  @apply font-semibold text-primary;
}
.account-sub {
  @apply text-sm text-muted;
}
.account-label {
  @apply block text-sm font-medium text-text mb-1.5;
}
.admin-input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition;
}
</style>
