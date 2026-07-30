<template>
  <div>
    <AdminHeader title="Campos personalizados globais">
      <AdminExportButton endpoint="/admin/exports/custom-fields" filename="campos_personalizados" />
      <button type="button" class="btn text-sm py-2" @click="openNew">+ Novo campo global</button>
    </AdminHeader>

    <p class="text-sm text-muted mb-4">
      Estes campos aparecem na inscrição de <strong>todos os cursos</strong>.
      Para campos de um curso específico, edite o curso em Cursos → Editar.
    </p>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <AdminFormPanel v-if="showForm" :title="editingId ? 'Editar campo global' : 'Novo campo global'">
      <div>
        <label class="form-label">Label (exibido ao cidadão)</label>
        <input v-model="form.label" type="text" required class="input-modern" />
      </div>
      <div>
        <label class="form-label">Tipo</label>
        <select v-model="form.type" class="input-modern">
          <option value="text">Texto</option>
          <option value="select">Seleção</option>
          <option value="file">Arquivo</option>
        </select>
      </div>
      <div v-if="form.type === 'select'">
        <label class="form-label">Opções (separadas por vírgula)</label>
        <input v-model="optionsText" type="text" class="input-modern" placeholder="Sim, Não" />
      </div>
      <div>
        <label class="form-label">Ordem</label>
        <input v-model.number="form.sort_order" type="number" min="0" class="input-modern" />
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.required" type="checkbox" />
        Campo obrigatório na inscrição
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
            <th class="px-4 py-3 text-left">Label</th>
            <th class="px-4 py-3 text-left">Tipo</th>
            <th class="px-4 py-3 text-left">Obrigatório</th>
            <th class="px-4 py-3 text-left">Ordem</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!fields.length" class="border-t">
            <td colspan="5" class="px-4 py-6 text-center text-muted">
              Nenhum campo global cadastrado.
            </td>
          </tr>
          <tr v-for="f in fields" :key="f.id" class="border-t">
            <td class="px-4 py-3">{{ f.label }}</td>
            <td class="px-4 py-3">{{ typeLabel(f.type) }}</td>
            <td class="px-4 py-3">{{ f.required ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-3">{{ f.sort_order ?? 0 }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => openEdit(f) },
                { label: 'Remover', danger: true, onClick: () => remove(f) },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'custom_fields' })

const fields = ref<any[]>([])
const loadError = ref('')
const dialog = useDialog()
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')
const optionsText = ref('')

const form = reactive({
  label: '',
  type: 'text',
  sort_order: 0,
  required: false,
})

function typeLabel(type: string) {
  const map: Record<string, string> = { text: 'Texto', select: 'Seleção', file: 'Arquivo' }
  return map[type] || type
}

async function load() {
  try {
    fields.value = await useApi<any[]>('/admin/custom-fields?global=1')
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar campos.'
  }
}

function openNew() {
  editingId.value = null
  form.label = ''
  form.type = 'text'
  form.sort_order = 0
  form.required = false
  optionsText.value = ''
  formError.value = ''
  showForm.value = true
}

function openEdit(f: any) {
  editingId.value = f.id
  form.label = f.label
  form.type = f.type
  form.sort_order = f.sort_order ?? 0
  form.required = f.required ?? false
  optionsText.value = (f.options || []).join(', ')
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

function buildBody() {
  const body: Record<string, unknown> = {
    label: form.label,
    type: form.type,
    sort_order: Number(form.sort_order) || 0,
    required: form.required,
    global_only: true,
    course_id: null,
  }
  if (form.type === 'select') {
    body.options = optionsText.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  } else {
    body.options = null
  }
  return body
}

async function save() {
  saving.value = true
  formError.value = ''
  try {
    const body = buildBody()
    if (editingId.value) {
      await useApi(`/admin/custom-fields/${editingId.value}`, { method: 'PUT', body })
    } else {
      await useApi('/admin/custom-fields', { method: 'POST', body })
    }
    showForm.value = false
    await load()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function remove(f: any) {
  if (!await dialog.confirm(`Remover campo global "${f.label}"?`, {
    title: 'Remover campo',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/custom-fields/${f.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
