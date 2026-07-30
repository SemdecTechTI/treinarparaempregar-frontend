<template>
  <div>
    <AdminHeader title="Perfis de acesso">
      <AdminExportButton endpoint="/admin/exports/profiles" filename="perfis_acesso" />
      <button type="button" class="btn text-sm py-2" @click="openNew">+ Novo perfil</button>
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <AdminFormPanel v-if="showForm" :title="editingId ? 'Editar perfil' : 'Novo perfil'">
      <div>
        <label class="form-label">Nome</label>
        <input v-model="form.name" type="text" required class="input-modern" placeholder="Ex.: Qualificação" />
      </div>
      <div>
        <label class="form-label">Descrição</label>
        <input v-model="form.description" type="text" class="input-modern" placeholder="Opcional" />
      </div>
      <div>
        <label class="form-label">Módulos permitidos</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
          <label
            v-for="mod in modules"
            :key="mod.key"
            class="flex items-center gap-2 text-sm border rounded px-3 py-2 cursor-pointer"
            :class="form.permissions.includes(mod.key) ? 'border-primary bg-primary/5' : 'border-gray-200'"
          >
            <input v-model="form.permissions" type="checkbox" :value="mod.key" class="accent-[#1a2d4a]" />
            {{ mod.label }}
          </label>
        </div>
        <div class="flex gap-3 mt-2">
          <button type="button" class="text-xs text-primary underline" @click="form.permissions = modules.map(m => m.key)">Marcar todos</button>
          <button type="button" class="text-xs text-muted underline" @click="form.permissions = []">Desmarcar todos</button>
        </div>
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
            <th class="px-4 py-3 text-left">Perfil</th>
            <th class="px-4 py-3 text-left">Módulos</th>
            <th class="px-4 py-3 text-left">Usuários</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!profiles.length" class="border-t">
            <td colspan="4" class="px-4 py-6 text-center text-muted">Nenhum perfil cadastrado.</td>
          </tr>
          <tr v-for="p in profiles" :key="p.id" class="border-t align-top">
            <td class="px-4 py-3">
              <p class="font-medium text-primary">{{ p.name }}</p>
              <p v-if="p.description" class="text-xs text-muted">{{ p.description }}</p>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="key in p.permissions"
                  :key="key"
                  class="inline-block text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5"
                >{{ moduleLabel(key) }}</span>
                <span v-if="!p.permissions?.length" class="text-xs text-muted">Nenhum módulo</span>
              </div>
            </td>
            <td class="px-4 py-3">{{ p.users_count ?? 0 }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => openEdit(p) },
                { label: 'Remover', danger: true, onClick: () => remove(p) },
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

interface AdminModule {
  key: string
  label: string
}

interface AdminProfile {
  id: number
  name: string
  description: string | null
  permissions: string[]
  users_count?: number
}

const dialog = useDialog()
const profiles = ref<AdminProfile[]>([])
const modules = ref<AdminModule[]>([])
const loadError = ref('')
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  name: '',
  description: '',
  permissions: [] as string[],
})

function moduleLabel(key: string) {
  return modules.value.find(m => m.key === key)?.label ?? key
}

async function load() {
  try {
    const [meta, list] = await Promise.all([
      useApi<{ modules: AdminModule[] }>('/admin/profiles/meta'),
      useApi<AdminProfile[]>('/admin/profiles'),
    ])
    modules.value = meta.modules
    profiles.value = list
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar perfis.'
  }
}

function openNew() {
  editingId.value = null
  form.name = ''
  form.description = ''
  form.permissions = []
  formError.value = ''
  showForm.value = true
}

function openEdit(p: AdminProfile) {
  editingId.value = p.id
  form.name = p.name
  form.description = p.description ?? ''
  form.permissions = [...(p.permissions ?? [])]
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
    const body = {
      name: form.name,
      description: form.description || null,
      permissions: form.permissions,
    }
    if (editingId.value) {
      await useApi(`/admin/profiles/${editingId.value}`, { method: 'PUT', body })
    } else {
      await useApi('/admin/profiles', { method: 'POST', body })
    }
    showForm.value = false
    await load()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Erro ao salvar perfil.'
  } finally {
    saving.value = false
  }
}

async function remove(p: AdminProfile) {
  if (!await dialog.confirm(`Remover o perfil "${p.name}"?`, {
    title: 'Remover perfil',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/profiles/${p.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
