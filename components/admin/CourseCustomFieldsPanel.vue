<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-4">
    <div>
      <h2 class="font-semibold text-primary">Campos personalizados deste curso</h2>
      <p class="text-xs text-muted mt-1">
        Campos extras na inscrição, só para este curso. Campos globais são gerenciados em Campos personalizados.
      </p>
    </div>

    <div v-if="courseId && loadError" class="text-red-600 text-sm">{{ loadError }}</div>

    <div v-if="showInlineForm" class="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
      <h3 class="text-sm font-semibold text-primary">{{ editingId ? 'Editar campo' : 'Novo campo' }}</h3>
      <div>
        <label class="form-label">Label (exibido ao cidadão)</label>
        <input v-model="draft.label" type="text" required class="input-modern" />
      </div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="form-label">Tipo</label>
          <select v-model="draft.type" class="input-modern">
            <option value="text">Texto</option>
            <option value="select">Seleção</option>
            <option value="file">Arquivo</option>
          </select>
        </div>
        <div>
          <label class="form-label">Ordem</label>
          <input v-model.number="draft.sort_order" type="number" min="0" class="input-modern" />
        </div>
      </div>
      <div v-if="draft.type === 'select'">
        <label class="form-label">Opções (separadas por vírgula)</label>
        <input v-model="draft.optionsText" type="text" class="input-modern" placeholder="Sim, Não" />
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="draft.required" type="checkbox" />
        Campo obrigatório na inscrição
      </label>
      <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
      <div class="flex flex-wrap gap-2">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar campo'" variant="primary" :disabled="saving" @click="saveField" />
        <AdminActionButton label="Cancelar" variant="outline" @click="cancelInlineForm" />
      </div>
    </div>

    <div v-else class="flex justify-end">
      <AdminActionButton label="+ Campo do curso" variant="outline" @click="openNew" />
    </div>

    <div class="overflow-hidden border border-slate-200 rounded-xl">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left">Label</th>
            <th class="px-4 py-2 text-left">Tipo</th>
            <th class="px-4 py-2 text-left">Obrigatório</th>
            <th class="px-4 py-2 text-left">Ordem</th>
            <th class="px-4 py-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!displayFields.length" class="border-t">
            <td colspan="5" class="px-4 py-6 text-center text-muted text-xs">
              Nenhum campo específico. Os campos globais continuam aplicados a este curso.
            </td>
          </tr>
          <tr v-for="f in displayFields" :key="fieldKey(f)" class="border-t">
            <td class="px-4 py-2">{{ f.label }}</td>
            <td class="px-4 py-2">{{ typeLabel(f.type) }}</td>
            <td class="px-4 py-2">{{ f.required ? 'Sim' : 'Não' }}</td>
            <td class="px-4 py-2">{{ f.sort_order ?? 0 }}</td>
            <td class="px-4 py-2">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => openEdit(f) },
                { label: 'Remover', danger: true, onClick: () => removeField(f) },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseCustomFieldDraft } from '~/types/custom-field'

const props = defineProps<{
  courseId?: number | null
}>()

const pending = defineModel<CourseCustomFieldDraft[]>('pending', { default: () => [] })

const fields = ref<CourseCustomFieldDraft[]>([])
const loadError = ref('')
const dialog = useDialog()
const showInlineForm = ref(false)
const editingId = ref<number | null>(null)
const editingLocalKey = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')

const draft = reactive({
  label: '',
  type: 'text',
  sort_order: 0,
  required: false,
  optionsText: '',
})

const displayFields = computed(() => (props.courseId ? fields.value : pending.value))

function typeLabel(type: string) {
  const map: Record<string, string> = { text: 'Texto', select: 'Seleção', file: 'Arquivo' }
  return map[type] || type
}

function fieldKey(f: CourseCustomFieldDraft) {
  return f.id ? `id-${f.id}` : f._localKey || f.label
}

function resetDraft() {
  draft.label = ''
  draft.type = 'text'
  draft.sort_order = 0
  draft.required = false
  draft.optionsText = ''
}

async function loadFields() {
  if (!props.courseId) return
  loadError.value = ''
  try {
    fields.value = await useApi<CourseCustomFieldDraft[]>(`/admin/custom-fields?course_id=${props.courseId}`)
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar campos do curso.'
  }
}

function openNew() {
  editingId.value = null
  editingLocalKey.value = null
  resetDraft()
  formError.value = ''
  showInlineForm.value = true
}

function openEdit(f: CourseCustomFieldDraft) {
  editingId.value = f.id ?? null
  editingLocalKey.value = f._localKey ?? null
  draft.label = f.label
  draft.type = f.type
  draft.sort_order = f.sort_order ?? 0
  draft.required = f.required ?? false
  draft.optionsText = (f.options || []).join(', ')
  formError.value = ''
  showInlineForm.value = true
}

function cancelInlineForm() {
  showInlineForm.value = false
  editingId.value = null
  editingLocalKey.value = null
  formError.value = ''
}

function buildOptions() {
  if (draft.type === 'select') {
    return draft.optionsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }
  return null
}

function buildDraftPayload(): CourseCustomFieldDraft {
  return {
    label: draft.label.trim(),
    type: draft.type,
    sort_order: Number(draft.sort_order) || 0,
    required: draft.required,
    options: buildOptions(),
    optionsText: draft.optionsText,
  }
}

async function saveField() {
  if (!draft.label.trim()) {
    formError.value = 'Informe o label do campo.'
    return
  }

  saving.value = true
  formError.value = ''

  try {
    const payload = buildDraftPayload()

    if (props.courseId) {
      const body = {
        course_id: props.courseId,
        label: payload.label,
        type: payload.type,
        sort_order: payload.sort_order,
        required: payload.required,
        options: payload.options,
      }
      if (editingId.value) {
        await useApi(`/admin/custom-fields/${editingId.value}`, { method: 'PUT', body })
      } else {
        await useApi('/admin/custom-fields', { method: 'POST', body })
      }
      await loadFields()
    } else {
      if (editingLocalKey.value) {
        const idx = pending.value.findIndex(f => f._localKey === editingLocalKey.value)
        if (idx >= 0) {
          pending.value[idx] = { ...payload, _localKey: editingLocalKey.value }
        }
      } else {
        pending.value.push({
          ...payload,
          _localKey: `local-${Date.now()}`,
        })
      }
    }
    cancelInlineForm()
  } catch (e: any) {
    formError.value = e?.data?.message || 'Erro ao salvar campo.'
  } finally {
    saving.value = false
  }
}

async function removeField(f: CourseCustomFieldDraft) {
  if (!await dialog.confirm(`Remover campo "${f.label}"?`, {
    title: 'Remover campo',
    confirmText: 'Remover',
    danger: true,
  })) return

  if (props.courseId && f.id) {
    try {
      await useApi(`/admin/custom-fields/${f.id}`, { method: 'DELETE' })
      await loadFields()
    } catch (e: any) {
      await dialog.error(e?.data?.message || 'Não foi possível remover.')
    }
  } else if (f._localKey) {
    pending.value = pending.value.filter(x => x._localKey !== f._localKey)
  }
}

onMounted(loadFields)
watch(() => props.courseId, loadFields)
</script>
