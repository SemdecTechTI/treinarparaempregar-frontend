<template>
  <div>
    <AdminHeader title="Usuários">
      <AdminExportButton endpoint="/admin/exports/users" filename="usuarios" />
      <button type="button" class="btn text-sm py-2" @click="openNew">+ Novo usuário</button>
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <AdminFormPanel v-if="showForm" :title="editingId ? 'Editar usuário' : 'Novo usuário'">
      <div>
        <label class="form-label">Nome</label>
        <input v-model="form.name" type="text" required class="input-modern" />
      </div>
      <div>
        <label class="form-label">Email</label>
        <input v-model="form.email" type="email" required class="input-modern" />
        <p v-if="existingAccount?.exists && existingAccount.staff" class="text-xs text-red-600 mt-1.5">
          Este e-mail já tem acesso ao painel.
        </p>
        <p v-else-if="existingAccount?.exists" class="text-xs text-accent mt-1.5">
          Conta encontrada: {{ existingAccount.name }}. O acesso será concedido à conta atual, sem alterar a senha.
        </p>
      </div>
      <div v-if="editingId || !existingAccount?.exists">
        <label class="form-label">Senha {{ editingId ? '(deixe em branco para manter)' : '' }}</label>
        <div class="flex gap-2">
          <div class="relative flex-1">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="input-modern pr-10" :required="!editingId && !existingAccount?.exists" autocomplete="new-password" />
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-primary" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L3 3m6.88 6.88L21 21"/></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
          <button type="button" class="btn btn-outline text-sm py-2 whitespace-nowrap" @click="generatePassword">Gerar</button>
        </div>
        <p v-if="!editingId" class="text-xs text-muted mt-1.5">A senha será enviada por e-mail. Se a pessoa já tem conta no site, use o mesmo e-mail e deixe a senha em branco.</p>
      </div>
      <div>
        <label class="form-label">Perfil</label>
        <select v-model="form.access" class="input-modern">
          <option value="admin">Administrador</option>
          <option v-for="p in profiles" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
        </select>
        <p class="text-xs text-muted mt-1">
          <template v-if="form.access === 'admin'">Administradores gerenciam todos os módulos, usuários e perfis.</template>
          <template v-else>O perfil define quais menus o usuário pode ver.
            <NuxtLink to="/admin/perfis" class="text-primary underline">Gerenciar perfis</NuxtLink>
          </template>
        </p>
      </div>
      <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar'" variant="primary" size="md" :disabled="saving || (!!existingAccount?.staff && !editingId)" @click="save" />
        <AdminActionButton label="Cancelar" variant="outline" size="md" @click="cancelForm" />
      </div>
    </AdminFormPanel>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Perfil</th>
            <th class="px-4 py-3 text-left whitespace-nowrap">Cadastro</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!users.length" class="border-t">
            <td colspan="5" class="px-4 py-6 text-center text-muted">Nenhum usuário interno.</td>
          </tr>
          <tr v-for="u in users" :key="u.id" class="border-t">
            <td class="px-4 py-3">{{ u.name }}</td>
            <td class="px-4 py-3">{{ u.email }}</td>
            <td class="px-4 py-3">{{ accessLabel(u) }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDateTime(u.created_at) }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => openEdit(u) },
                { label: 'Remover acesso', danger: true, onClick: () => remove(u) },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>

      <AdminPagination :meta="meta" @change="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '~/utils/datetime'

definePageMeta({ layout: 'admin', middleware: 'admin', adminOnly: true })

const auth = useAuthStore()
const dialog = useDialog()
const users = ref<any[]>([])
const loadError = ref('')
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')
const showPassword = ref(false)
const existingAccount = ref<{ exists: boolean, staff?: boolean, name?: string } | null>(null)
let lookupTimer: ReturnType<typeof setTimeout> | null = null

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*'
  const arr = new Uint32Array(14)
  crypto.getRandomValues(arr)
  form.password = Array.from(arr, (n) => chars[n % chars.length]).join('')
  showPassword.value = true
}

const profiles = ref<any[]>([])

const form = reactive({
  name: '',
  email: '',
  password: '',
  access: 'admin' as string,
})

function accessLabel(u: any) {
  if (u.role === 'admin') return 'Administrador'
  return u.admin_profile?.name || 'Sem perfil'
}

async function lookupEmail(email: string) {
  try {
    const data = await useApi<{ exists: boolean, staff?: boolean, name?: string }>(
      `/admin/users/lookup?email=${encodeURIComponent(email)}`,
    )
    if (form.email.trim().toLowerCase() !== email.trim().toLowerCase()) return
    existingAccount.value = data
    if (data.exists && !data.staff && data.name && !form.name.trim()) {
      form.name = data.name
    }
    if (data.exists && data.staff) {
      formError.value = 'Este e-mail já tem acesso ao painel.'
    } else if (formError.value === 'Este e-mail já tem acesso ao painel.') {
      formError.value = ''
    }
  } catch {
    existingAccount.value = null
  }
}

watch(() => form.email, (email) => {
  existingAccount.value = null
  if (editingId.value) return
  const trimmed = email.trim()
  if (!trimmed.includes('@')) return
  if (lookupTimer) clearTimeout(lookupTimer)
  lookupTimer = setTimeout(() => lookupEmail(trimmed), 400)
})

async function load(page = meta.current_page) {
  try {
    const [userData, profileList] = await Promise.all([
      useApi<any>(`/admin/users?page=${page}`),
      useApi<any[]>('/admin/profiles'),
    ])
    users.value = userData.data ?? []
    meta.current_page = userData.current_page ?? 1
    meta.last_page = userData.last_page ?? 1
    meta.total = userData.total ?? users.value.length
    profiles.value = profileList
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar usuários.'
  }
}

function openNew() {
  editingId.value = null
  form.name = ''
  form.email = ''
  form.password = ''
  form.access = profiles.value[0] ? String(profiles.value[0].id) : 'admin'
  formError.value = ''
  existingAccount.value = null
  showPassword.value = false
  showForm.value = true
}

function openEdit(u: any) {
  editingId.value = u.id
  form.name = u.name
  form.email = u.email
  form.password = ''
  form.access = u.role === 'admin' ? 'admin' : String(u.admin_profile_id ?? '')
  formError.value = ''
  existingAccount.value = null
  showPassword.value = false
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

async function save() {
  saving.value = true
  formError.value = ''
  try {
    const isAdmin = form.access === 'admin'
    if (!isAdmin && !form.access) {
      await dialog.toastError('Selecione um perfil de acesso.')
      return
    }

    const body: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      role: isAdmin ? 'admin' : 'atendente',
      admin_profile_id: isAdmin ? null : Number(form.access),
    }
    if (form.password) body.password = form.password

    const isEdit = editingId.value !== null
    await ensureSanctumCsrf()
    if (editingId.value) {
      await useApi(`/admin/users/${editingId.value}`, { method: 'PUT', body })
      showForm.value = false
      await load()
      await dialog.toastSuccess('Usuário atualizado.')
    } else {
      if (existingAccount.value?.staff) {
        await dialog.toastError('Este e-mail já tem acesso ao painel.')
        return
      }
      if (!existingAccount.value?.exists && !form.password) {
        await dialog.toastError('Senha é obrigatória para novo usuário.')
        return
      }
      if (existingAccount.value?.exists) {
        delete body.password
      }
      const created = await useApi<{ promoted?: boolean }>('/admin/users', { method: 'POST', body })
      showForm.value = false
      await load()
      await dialog.toastSuccess(
        created?.promoted
          ? 'Acesso concedido. A pessoa continua com a mesma senha e receberá um e-mail.'
          : 'Usuário criado. Credenciais enviadas por e-mail.',
      )
    }
  } catch (e: any) {
    await dialog.toastError(e?.data?.message || 'Erro ao salvar.')
  } finally {
    saving.value = false
  }
}

async function remove(u: any) {
  if (u.id === auth.user?.id) {
    await dialog.alert('Você não pode remover o próprio acesso.', 'Aviso', 'warning')
    return
  }
  if (!await dialog.confirm(
    `"${u.name}" deixa de acessar o painel e passa a ser cidadão. A conta e o login são mantidos.`,
    {
      title: 'Remover acesso',
      confirmText: 'Remover acesso',
      danger: true,
    },
  )) return
  try {
    await ensureSanctumCsrf()
    await useApi(`/admin/users/${u.id}`, { method: 'DELETE' })
    await load()
    await dialog.toastSuccess('Acesso removido. A pessoa agora aparece em Cidadãos.')
  } catch (e: any) {
    await dialog.toastError(e?.data?.message || 'Não foi possível remover o acesso.')
  }
}

onMounted(load)
</script>
