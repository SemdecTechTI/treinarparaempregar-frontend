<template>
  <div>
    <AdminHeader title="Trilhas">
      <AdminExportButton endpoint="/admin/exports/tracks" filename="trilhas" />
      <button type="button" class="btn text-sm py-2" @click="openNew">+ Nova trilha</button>
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <AdminFormPanel v-if="showForm" :title="editingId ? 'Editar trilha' : 'Nova trilha'">
      <div>
        <label class="form-label">Nome</label>
        <input v-model="form.name" type="text" required class="input-modern" placeholder="Ex.: Construção Civil" />
      </div>
      <div>
        <label class="form-label">Identificador (slug)</label>
        <input v-model="form.slug" type="text" class="input-modern" placeholder="Gerado automaticamente se vazio" />
        <p class="text-xs text-muted mt-1">Usado na URL/filtros (ex.: tecnicos). Evite alterar se já houver cursos.</p>
      </div>
      <div>
        <label class="form-label">Ordem</label>
        <input v-model.number="form.sort_order" type="number" min="0" class="input-modern" />
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.active" type="checkbox" />
        Ativa (aparece nos filtros e no cadastro de cursos)
      </label>
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
            <th class="px-4 py-3 text-left">Slug</th>
            <th class="px-4 py-3 text-left">Ordem</th>
            <th class="px-4 py-3 text-left">Ativa</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length" class="border-t">
            <td colspan="5" class="px-4 py-6 text-center text-muted">Nenhuma trilha cadastrada.</td>
          </tr>
          <tr v-for="t in rows" :key="t.id" class="border-t">
            <td class="px-4 py-3 font-medium">{{ t.name }}</td>
            <td class="px-4 py-3 text-muted">{{ t.slug }}</td>
            <td class="px-4 py-3">{{ t.sort_order }}</td>
            <td class="px-4 py-3">
              <span :class="t.active ? 'text-green-700' : 'text-muted'">{{ t.active ? 'Sim' : 'Não' }}</span>
            </td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => openEdit(t) },
                { label: 'Remover', danger: true, onClick: () => remove(t) },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clearTracksCache } from '~/utils/tracks'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'tracks' })

type TrackRow = {
  id: number
  name: string
  slug: string
  sort_order: number
  active: boolean
}

const rows = ref<TrackRow[]>([])
const loadError = ref('')
const dialog = useDialog()
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  name: '',
  slug: '',
  sort_order: 0,
  active: true,
})

function openNew() {
  editingId.value = null
  form.name = ''
  form.slug = ''
  form.sort_order = (rows.value.at(-1)?.sort_order ?? 0) + 1
  form.active = true
  formError.value = ''
  showForm.value = true
}

function openEdit(t: TrackRow) {
  editingId.value = t.id
  form.name = t.name
  form.slug = t.slug
  form.sort_order = t.sort_order
  form.active = t.active
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
  formError.value = ''
}

async function load() {
  loadError.value = ''
  try {
    rows.value = await useApi<TrackRow[]>('/admin/tracks')
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar trilhas.'
  }
}

async function save() {
  formError.value = ''
  if (!form.name.trim()) {
    formError.value = 'Informe o nome da trilha.'
    return
  }
  saving.value = true
  try {
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
    }
    if (editingId.value) {
      await useApi(`/admin/tracks/${editingId.value}`, { method: 'PUT', body })
    } else {
      await useApi('/admin/tracks', { method: 'POST', body })
    }
    cancelForm()
    clearTracksCache()
    await load()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Não foi possível salvar.'
  } finally {
    saving.value = false
  }
}

async function remove(t: TrackRow) {
  if (!await dialog.confirm(`Remover a trilha "${t.name}"?`, {
    title: 'Remover trilha',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/tracks/${t.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
