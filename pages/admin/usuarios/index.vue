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
      </div>
      <div>
        <label class="form-label">Senha {{ editingId ? '(deixe em branco para manter)' : '' }}</label>
        <input v-model="form.password" type="password" class="input-modern" :required="!editingId" />
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
        <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar'" variant="primary" size="md" :disabled="saving" @click="save" />
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
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!users.length" class="border-t">
            <td colspan="4" class="px-4 py-6 text-center text-muted">Nenhum usuário interno.</td>
          </tr>
          <tr v-for="u in users" :key="u.id" class="border-t">
            <td class="px-4 py-3">{{ u.name }}</td>
            <td class="px-4 py-3">{{ u.email }}</td>
            <td class="px-4 py-3">{{ accessLabel(u) }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => openEdit(u) },
                { label: 'Remover', danger: true, onClick: () => remove(u) },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminOnly: true })

const auth = useAuthStore()
const dialog = useDialog()
const users = ref<any[]>([])
const loadError = ref('')
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

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

async function load() {
  try {
    const [userList, profileList] = await Promise.all([
      useApi<any[]>('/admin/users'),
      useApi<any[]>('/admin/profiles'),
    ])
    users.value = userList
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
  showForm.value = true
}

function openEdit(u: any) {
  editingId.value = u.id
  form.name = u.name
  form.email = u.email
  form.password = ''
  form.access = u.role === 'admin' ? 'admin' : String(u.admin_profile_id ?? '')
  formError.value = ''
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
      formError.value = 'Selecione um perfil de acesso.'
      return
    }

    const body: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      role: isAdmin ? 'admin' : 'atendente',
      admin_profile_id: isAdmin ? null : Number(form.access),
    }
    if (form.password) body.password = form.password

    if (editingId.value) {
      await useApi(`/admin/users/${editingId.value}`, { method: 'PUT', body })
    } else {
      if (!form.password) {
        formError.value = 'Senha é obrigatória para novo usuário.'
        return
      }
      await useApi('/admin/users', { method: 'POST', body })
    }
    showForm.value = false
    await load()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function remove(u: any) {
  if (u.id === auth.user?.id) {
    await dialog.alert('Você não pode remover sua própria conta.', 'Aviso', 'warning')
    return
  }
  if (!await dialog.confirm(`Remover usuário "${u.name}"?`, {
    title: 'Remover usuário',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/users/${u.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
