<template>
  <div>
    <AdminHeader title="Campos personalizados globais">
      <AdminExportButton endpoint="/admin/exports/custom-fields" filename="campos_personalizados" />
      <button type="button" class="btn text-sm py-2" @click="openNew">+ Novo campo global</button>
    </AdminHeader>

    <p class="text-sm text-muted mb-4">
      Campos globais podem aparecer em <strong>todos os cursos</strong> ou ficar na biblioteca para o curso escolher na edição.
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
      <label class="flex items-start gap-2 text-sm">
        <input v-model="form.apply_to_all" type="checkbox" class="mt-0.5" />
        <span>
          Aplicar automaticamente em todos os cursos.
          <span class="block text-xs text-muted">Desmarque para o campo ficar só na biblioteca. Cada curso escolhe se usa.</span>
        </span>
      </label>
      <div class="grid sm:grid-cols-3 gap-3">
        <div class="sm:col-span-3">
          <label class="form-label">Condicionar este campo</label>
          <p class="text-xs text-muted mb-2">Opcional. Só aparece se outro campo global tiver determinada resposta.</p>
        </div>
        <div>
          <label class="form-label">Campo</label>
          <select v-model="form.condition_field_id" class="input-modern">
            <option :value="null">Sem condição</option>
            <option v-for="opt in conditionOptions" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
          </select>
        </div>
        <div>
          <label class="form-label">Quando</label>
          <select v-model="form.condition_operator" class="input-modern" :disabled="!form.condition_field_id">
            <option value="equals">for igual a</option>
            <option value="not_equals">não for igual a</option>
          </select>
        </div>
        <div>
          <label class="form-label">Valor</label>
          <input v-model="form.condition_value" type="text" class="input-modern" :disabled="!form.condition_field_id" placeholder="Não se aplica" />
        </div>
      </div>
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
            <th class="px-4 py-3 text-left">Uso</th>
            <th class="px-4 py-3 text-left">Ordem</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!fields.length" class="border-t">
            <td colspan="6" class="px-4 py-6 text-center text-muted">
              Nenhum campo global cadastrado.
            </td>
          </tr>
          <tr v-for="f in fields" :key="f.id" class="border-t">
            <td class="px-4 py-3">
              <p>{{ f.label }}</p>
              <p v-if="f.condition_field_id" class="text-xs text-muted mt-1">
                Condicionado a outro campo
              </p>
            </td>
            <td class="px-4 py-3">{{ typeLabel(f.type) }}</td>
            <td class="px-4 py-3">{{ f.required ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-3">{{ f.apply_to_all ? 'Todos os cursos' : 'Biblioteca' }}</td>
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

      <AdminPagination :meta="meta" @change="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'custom_fields' })

const fields = ref<any[]>([])
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })
const loadError = ref('')
const dialog = useDialog()
const showForm = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const optionsText = ref('')

const form = reactive({
  label: '',
  type: 'text',
  sort_order: 0,
  required: false,
  apply_to_all: false,
  condition_field_id: null as number | null,
  condition_operator: 'not_equals',
  condition_value: '',
})

const conditionOptions = computed(() =>
  fields.value.filter(f => f.id !== editingId.value && f.type === 'select'),
)

function typeLabel(type: string) {
  const map: Record<string, string> = { text: 'Texto', select: 'Seleção', file: 'Arquivo' }
  return map[type] || type
}

async function load(page = meta.current_page) {
  try {
    const data = await useApi<any>(`/admin/custom-fields?global=1&page=${page}`)
    fields.value = data.data ?? []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? fields.value.length
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
  form.apply_to_all = false
  form.condition_field_id = null
  form.condition_operator = 'not_equals'
  form.condition_value = ''
  optionsText.value = ''
  showForm.value = true
}

function openEdit(f: any) {
  editingId.value = f.id
  form.label = f.label
  form.type = f.type
  form.sort_order = f.sort_order ?? 0
  form.required = f.required ?? false
  form.apply_to_all = f.apply_to_all ?? true
  form.condition_field_id = f.condition_field_id ?? null
  form.condition_operator = f.condition_operator || 'not_equals'
  form.condition_value = f.condition_value || ''
  optionsText.value = (f.options || []).join(', ')
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
    apply_to_all: form.apply_to_all,
    global_only: true,
    course_id: null,
    condition_field_id: form.condition_field_id || null,
    condition_operator: form.condition_field_id ? form.condition_operator : null,
    condition_value: form.condition_field_id ? form.condition_value : null,
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
  try {
    const body = buildBody()
    const updated = Boolean(editingId.value)
    if (editingId.value) {
      await useApi(`/admin/custom-fields/${editingId.value}`, { method: 'PUT', body })
    } else {
      await useApi('/admin/custom-fields', { method: 'POST', body })
    }
    showForm.value = false
    await load()
    await dialog.toastSuccess(updated ? 'Campo atualizado.' : 'Campo cadastrado.')
  } catch (e: any) {
    await dialog.toastError(e?.data?.message || 'Erro ao salvar.')
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
    await dialog.toastError(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
