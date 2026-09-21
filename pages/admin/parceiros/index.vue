<template>
  <div>
    <AdminHeader title="Parceiros">
      <AdminExportButton endpoint="/admin/exports/partners" filename="parceiros" />
      <button type="button" class="btn text-sm py-2" @click="openNew">+ Novo parceiro</button>
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <AdminFormPanel v-if="showForm" :title="editingId ? 'Editar parceiro' : 'Novo parceiro'">
      <div>
        <label class="form-label">Nome *</label>
        <input v-model="form.name" type="text" required class="input-modern" />
      </div>
      <AdminImageUploadField
        v-model="form.logo"
        label="Logo"
        hint="Opcional. PNG, JPG ou WebP — aparece na home e no cadastro."
        context="partner_logo"
      />
      <div>
        <label class="form-label">Site</label>
        <input
          v-model="form.website_url"
          type="text"
          inputmode="url"
          autocomplete="url"
          class="input-modern"
          placeholder="www.exemplo.com"
          @blur="form.website_url = normalizeWebsiteUrl(form.website_url)"
        />
        <p class="text-xs text-muted mt-1">Opcional. Pode informar só o endereço, como empresa.com.br. Se preenchido, o card fica clicável na página pública de parceiros.</p>
      </div>
      <div>
        <label class="form-label">Email de contato</label>
        <input v-model="form.contact_email" type="email" class="input-modern" />
      </div>
      <div>
        <label class="form-label">Telefone</label>
        <input v-model="form.contact_phone" type="text" class="input-modern" />
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
            <th class="px-4 py-3 text-left">Parceiro</th>
            <th class="px-4 py-3 text-left">Site</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Telefone</th>
            <th class="px-4 py-3 text-left whitespace-nowrap">Cadastro</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!partners.length" class="border-t">
            <td colspan="6" class="px-4 py-6 text-center text-muted">Nenhum parceiro cadastrado.</td>
          </tr>
          <tr v-for="p in partners" :key="p.id" class="border-t">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3 min-w-0">
                <img
                  v-if="p.logo"
                  :src="resolveMediaUrl(p.logo)"
                  :alt="p.name"
                  class="w-10 h-10 rounded-lg object-contain border border-gray-200 bg-white p-0.5 shrink-0"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0"
                >
                  {{ initials(p.name) }}
                </div>
                <span class="font-medium truncate">{{ p.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <a
                v-if="p.website_url"
                :href="p.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent hover:underline truncate block max-w-[220px]"
              >
                {{ p.website_url.replace(/^https?:\/\//, '') }}
              </a>
              <span v-else>—</span>
            </td>
            <td class="px-4 py-3">{{ p.contact_email || '—' }}</td>
            <td class="px-4 py-3">{{ p.contact_phone || '—' }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDateTime(p.created_at) }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => openEdit(p) },
                { label: 'Excluir', danger: true, onClick: () => remove(p) },
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
import { resolveMediaUrl } from '~/utils/media'
import { normalizeWebsiteUrl } from '~/utils/url'
import AdminImageUploadField from '~/components/admin/ImageUploadField.vue'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'partners' })

const partners = ref<any[]>([])
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })
const loadError = ref('')
const dialog = useDialog()
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  name: '',
  website_url: '',
  contact_email: '',
  contact_phone: '',
  logo: '',
})

function initials(name?: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}

async function load(page = meta.current_page) {
  try {
    const data = await useApi<any>(`/admin/partners?page=${page}`)
    partners.value = data.data ?? []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? partners.value.length
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar parceiros.'
  }
}

function openNew() {
  editingId.value = null
  form.name = ''
  form.website_url = ''
  form.contact_email = ''
  form.contact_phone = ''
  form.logo = ''
  formError.value = ''
  showForm.value = true
}

function openEdit(p: any) {
  editingId.value = p.id
  form.name = p.name
  form.website_url = p.website_url || ''
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
  if (!form.name.trim()) {
    formError.value = 'Informe o nome do parceiro.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    await ensureSanctumCsrf()
    const body = {
      name: form.name.trim(),
      website_url: normalizeWebsiteUrl(form.website_url) || null,
      contact_email: form.contact_email.trim() || null,
      contact_phone: form.contact_phone.trim() || null,
      logo: form.logo || null,
    }
    if (editingId.value) {
      await useApi(`/admin/partners/${editingId.value}`, { method: 'PUT', body })
    } else {
      await useApi('/admin/partners', { method: 'POST', body })
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
  if (!await dialog.confirm(`Excluir o parceiro "${p.name}"? Ele some da home e da listagem, mas os cursos vinculados permanecem.`, {
    title: 'Excluir parceiro',
    confirmText: 'Excluir',
    danger: true,
  })) return
  try {
    await ensureSanctumCsrf()
    await useApi(`/admin/partners/${p.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível excluir.')
  }
}

onMounted(load)
</script>
