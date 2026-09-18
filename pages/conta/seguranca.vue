<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
    <section class="card-flat p-6 min-w-0 flex flex-col">
      <h2 class="font-semibold text-primary">Alterar senha</h2>
      <p class="text-sm text-muted mt-1 mb-5">Confirme com a senha atual para definir uma nova.</p>
      <form class="flex flex-col gap-4 flex-1" @submit.prevent="savePassword">
        <div>
          <label class="form-label">Senha atual</label>
          <input v-model="pwd.current_password" type="password" class="input-modern" autocomplete="current-password" required />
        </div>
        <div>
          <label class="form-label">Nova senha</label>
          <input v-model="pwd.password" type="password" class="input-modern" autocomplete="new-password" minlength="8" required />
        </div>
        <div>
          <label class="form-label">Confirmar nova senha</label>
          <input v-model="pwd.password_confirmation" type="password" class="input-modern" autocomplete="new-password" required />
        </div>
        <div class="flex justify-end mt-auto pt-2">
          <button type="submit" class="btn text-sm py-2.5 px-5" :disabled="savingPwd">
            {{ savingPwd ? 'Alterando…' : 'Alterar senha' }}
          </button>
        </div>
      </form>
    </section>

    <section class="card-flat p-6 min-w-0 flex flex-col">
      <h2 class="font-semibold text-primary">Alterar e-mail</h2>
      <p class="text-sm text-muted mt-1 mb-5">
        E-mail atual: <strong class="text-text break-all">{{ auth.user?.email }}</strong>.
        Enviaremos um código de confirmação para o <strong>novo e-mail</strong>.
      </p>

      <form v-if="!emailStep2" class="flex flex-col gap-4 flex-1" @submit.prevent="requestEmailChange">
        <div>
          <label class="form-label">Novo e-mail</label>
          <input v-model="emailForm.email" type="email" class="input-modern" required />
        </div>
        <div>
          <label class="form-label">Sua senha atual</label>
          <input v-model="emailForm.current_password" type="password" class="input-modern" autocomplete="current-password" required />
        </div>
        <div class="flex justify-end mt-auto pt-2">
          <button type="submit" class="btn text-sm py-2.5 px-5" :disabled="requestingEmail">
            {{ requestingEmail ? 'Enviando…' : 'Enviar código' }}
          </button>
        </div>
      </form>

      <form v-else class="flex flex-col gap-4 flex-1" @submit.prevent="confirmEmailChange">
        <div class="rounded-xl bg-accent/10 text-primary p-3 text-sm">
          <p>Enviamos um código para <strong class="break-all">{{ pendingEmail }}</strong>. Digite-o abaixo para confirmar a troca.</p>
        </div>
        <div>
          <label class="form-label">Código de confirmação</label>
          <input
            v-model="emailForm.code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            class="input-modern tracking-[0.5em] text-center text-lg font-semibold"
            placeholder="000000"
            required
          />
        </div>
        <div class="flex flex-wrap justify-end gap-2 mt-auto pt-2">
          <button type="button" class="btn btn-outline text-sm py-2.5 px-5" @click="cancelEmailChange">Cancelar</button>
          <button type="submit" class="btn text-sm py-2.5 px-5" :disabled="confirmingEmail">
            {{ confirmingEmail ? 'Confirmando…' : 'Confirmar troca' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { apiErrorMessage } from '~/utils/apiError'

usePageSeo({
  title: 'Senha e e-mail',
  description: 'Altere a senha e o e-mail da sua conta no Treinar para Empregar.',
  path: '/conta/seguranca',
  noindex: true,
})

const auth = useAuthStore()
const dialog = useDialog()

const pwd = reactive({ current_password: '', password: '', password_confirmation: '' })
const emailForm = reactive({ email: '', current_password: '', code: '' })

const savingPwd = ref(false)
const requestingEmail = ref(false)
const confirmingEmail = ref(false)
const emailStep2 = ref(false)
const pendingEmail = ref('')

async function savePassword() {
  savingPwd.value = true
  try {
    await ensureSanctumCsrf()
    await useApi('/account/password', { method: 'PUT', body: { ...pwd } })
    pwd.current_password = pwd.password = pwd.password_confirmation = ''
    await dialog.success('Senha alterada com sucesso.')
  } catch (e) {
    await dialog.error(apiErrorMessage(e, 'Não foi possível alterar a senha.'))
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
    await dialog.error(apiErrorMessage(e, 'Não foi possível enviar o código.'))
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
    await dialog.error(apiErrorMessage(e, 'Não foi possível confirmar a troca.'))
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
