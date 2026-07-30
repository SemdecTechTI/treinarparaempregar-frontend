<template>
  <div>
    <AdminHeader title="Parceiros">
      <AdminExportButton endpoint="/admin/exports/partners" filename="parceiros" />
      <button type="button" class="btn text-sm py-2" @click="openNew">+ Novo parceiro</button>
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <AdminFormPanel v-if="showForm" :title="editingId ? 'Editar parceiro' : 'Novo parceiro'">
      <div>
        <label class="form-label">Nome</label>
        <input v-model="form.name" type="text" required class="input-modern" />
      </div>
      <div>
        <label class="form-label">Email de contato</label>
        <input v-model="form.contact_email" type="email" class="input-modern" />
      </div>
      <div>
        <label class="form-label">Telefone</label>
        <input v-model="form.contact_phone" type="text" class="input-modern" />
      </div>
      <div>
        <AdminImageUploadField
          v-model="form.logo"
          label="Logo"
          hint="Envie o logo do parceiro (PNG, JPG ou WebP)."
          context="partner_logo"
        />
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
            <th class="px-4 py-3 text-left">Telefone</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!partners.length" class="border-t">
            <td colspan="4" class="px-4 py-6 text-center text-muted">Nenhum parceiro cadastrado.</td>
          </tr>
          <tr v-for="p in partners" :key="p.id" class="border-t">
            <td class="px-4 py-3 font-medium">{{ p.name }}</td>
            <td class="px-4 py-3">{{ p.contact_email || '—' }}</td>
            <td class="px-4 py-3">{{ p.contact_phone || '—' }}</td>
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
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'partners' })

const partners = ref<any[]>([])
const loadError = ref('')
const dialog = useDialog()
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  name: '',
  contact_email: '',
  contact_phone: '',
  logo: '',
})

async function load() {
  try {
    partners.value = await useApi<any[]>('/admin/partners')
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar parceiros.'
  }
}

function openNew() {
  editingId.value = null
  form.name = ''
  form.contact_email = ''
  form.contact_phone = ''
  form.logo = ''
  formError.value = ''
  showForm.value = true
}

function openEdit(p: any) {
  editingId.value = p.id
  form.name = p.name
  form.contact_email = p.contact_email || ''
  form.contact_phone = p.contact_phone || ''
  form.logo = p.logo || ''
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
    if (editingId.value) {
      await useApi(`/admin/partners/${editingId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await useApi('/admin/partners', { method: 'POST', body: { ...form } })
    }
    showForm.value = false
    await load()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function remove(p: any) {
  if (!await dialog.confirm(`Remover parceiro "${p.name}"?`, {
    title: 'Remover parceiro',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/partners/${p.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
