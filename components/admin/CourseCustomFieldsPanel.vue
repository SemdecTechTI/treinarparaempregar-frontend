<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-6">
    <div>
      <h2 class="font-semibold text-primary">Campos personalizados deste curso</h2>
      <p class="text-xs text-muted mt-1">
        Campos de todos os cursos entram na lista (não dá para remover). Os da biblioteca você liga ou desliga. A ordem vale na inscrição.
      </p>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-primary mb-2">Ordem na inscrição</h3>
      <p v-if="!librarySelection.length" class="text-xs text-muted">
        Nenhum campo global ou de biblioteca. Crie em Campos personalizados.
      </p>
      <div v-else class="space-y-2">
        <label
          v-for="item in librarySelection"
          :key="item.id"
          class="flex flex-wrap items-center gap-3 border border-slate-200 rounded-xl px-3 py-2"
        >
          <input
            v-model="item.selected"
            type="checkbox"
            class="accent-[#1a2d4a]"
            :disabled="item.locked"
            @change="persistLibrary"
          />
          <span class="text-sm flex-1 min-w-[12rem]">
            {{ item.label }}
            <span v-if="item.locked" class="block text-xs text-muted mt-0.5">Todos os cursos. Não pode remover.</span>
            <span v-if="item.conditionHint" class="block text-xs text-muted mt-0.5">{{ item.conditionHint }}</span>
          </span>
          <span class="flex items-center gap-2 text-xs text-muted">
            Ordem
            <input
              v-model.number="item.sort_order"
              type="number"
              min="0"
              class="input-modern w-20 py-1"
              :disabled="!item.selected"
              @change="persistLibrary"
            />
          </span>
        </label>
      </div>
    </div>

    <div class="border-t border-slate-100 pt-4 space-y-4">
      <h3 class="text-sm font-semibold text-primary">Campos só deste curso</h3>

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
        <div class="grid sm:grid-cols-3 gap-3">
          <div>
            <label class="form-label">Condicionar a</label>
            <select v-model="draft.condition_field_id" class="input-modern">
              <option :value="null">Sem condição</option>
              <option v-for="opt in conditionSources" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">Quando</label>
            <select v-model="draft.condition_operator" class="input-modern" :disabled="!draft.condition_field_id">
              <option value="equals">for igual a</option>
              <option value="not_equals">não for igual a</option>
            </select>
          </div>
          <div>
            <label class="form-label">Valor</label>
            <input v-model="draft.condition_value" type="text" class="input-modern" :disabled="!draft.condition_field_id" />
          </div>
        </div>
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
                Nenhum campo exclusivo deste curso.
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
  </div>
</template>

<script setup lang="ts">
import type { CourseCustomFieldDraft, LibraryFieldAttachment } from '~/types/custom-field'

const props = defineProps<{
  courseId?: number | null
}>()

const pending = defineModel<CourseCustomFieldDraft[]>('pending', { default: () => [] })
const pendingLibrary = defineModel<LibraryFieldAttachment[]>('pendingLibrary', { default: () => [] })

const fields = ref<CourseCustomFieldDraft[]>([])
const libraryFields = ref<any[]>([])
const globalFields = ref<any[]>([])
const librarySelection = ref<LibraryFieldAttachment[]>([])
const loadError = ref('')
const dialog = useDialog()
const showInlineForm = ref(false)
const editingId = ref<number | null>(null)
const editingLocalKey = ref<string | null>(null)
const saving = ref(false)
const persistTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const draft = reactive({
  label: '',
  type: 'text',
  sort_order: 0,
  required: false,
  optionsText: '',
  condition_field_id: null as number | null,
  condition_operator: 'not_equals',
  condition_value: '',
})

const displayFields = computed(() => (props.courseId ? fields.value : pending.value))

const conditionSources = computed(() => {
  const attached = librarySelection.value.filter(item => item.selected).map(item => ({
    id: item.id,
    label: item.label,
  }))
  return [...attached, ...globalFields.value]
})

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
  draft.condition_field_id = null
  draft.condition_operator = 'not_equals'
  draft.condition_value = ''
}

function conditionHint(field: any, available: any[]) {
  if (!field.condition_field_id) return ''
  const source = available.find((item: any) => item.id === field.condition_field_id)
    || globalFields.value.find((item: any) => item.id === field.condition_field_id)
  const sourceLabel = source?.label || 'outra pergunta'
  if (field.condition_operator === 'not_equals') {
    return `Na inscrição só aparece se "${sourceLabel}" não for "${field.condition_value}".`
  }
  if (field.condition_operator === 'equals') {
    return `Na inscrição só aparece se "${sourceLabel}" for "${field.condition_value}".`
  }
  return ''
}

function catalogFields() {
  const seen = new Set<number>()
  const list: any[] = []
  for (const field of [...globalFields.value, ...libraryFields.value]) {
    if (!field?.id || seen.has(field.id)) continue
    seen.add(field.id)
    list.push(field)
  }
  return list
}

function buildLibrarySelection(available: any[], attached: any[]) {
  const attachedMap = new Map(attached.map((field: any) => [field.id, field.pivot?.sort_order ?? field.sort_order ?? 0]))
  const pendingMap = new Map(pendingLibrary.value.map(item => [item.id, item]))
  const maxKnown = Math.max(
    -1,
    ...attachedMap.values(),
    ...pendingLibrary.value.map(item => Number(item.sort_order) || 0),
  )
  let nextFallback = maxKnown

  librarySelection.value = available.map((field: any, index: number) => {
    const locked = Boolean(field.apply_to_all)
    const pending = pendingMap.get(field.id)
    let sortOrder = attachedMap.get(field.id) ?? pending?.sort_order
    if (sortOrder == null) {
      if (locked) {
        nextFallback += 1
        sortOrder = nextFallback
      } else {
        sortOrder = field.sort_order ?? index
      }
    }

    return {
      id: field.id,
      label: field.label,
      type: field.type,
      locked,
      selected: locked || attachedMap.has(field.id) || Boolean(pending?.selected),
      sort_order: Number(sortOrder) || 0,
      conditionHint: conditionHint(field, available),
    }
  }).sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label, 'pt-BR'))
}

async function loadCatalog() {
  const list = await useApi<any>('/admin/courses')
  libraryFields.value = list.library_fields || []
  globalFields.value = list.global_fields || []
}

async function loadFields() {
  loadError.value = ''
  try {
    await loadCatalog()
    if (props.courseId) {
      const course = await useApi<any>(`/admin/courses/${props.courseId}`)
      fields.value = (course.custom_fields || []).filter((field: any) => field.course_id === props.courseId)
      const attached = course.library_fields || []
      buildLibrarySelection(catalogFields(), attached)
      const attachedIds = new Set(attached.map((field: any) => field.id))
      if (globalFields.value.some((field: any) => !attachedIds.has(field.id))) {
        persistLibrary()
      }
    } else {
      buildLibrarySelection(catalogFields(), pendingLibrary.value.filter(item => item.selected))
      persistLibrary()
    }
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar campos do curso.'
  }
}

function persistLibrary() {
  const selected = librarySelection.value
    .filter(item => item.locked || item.selected)
    .map(item => ({
      id: item.id,
      label: item.label,
      sort_order: Number(item.sort_order) || 0,
      selected: true,
      locked: item.locked,
    }))

  pendingLibrary.value = selected

  if (!props.courseId) return

  if (persistTimer.value) clearTimeout(persistTimer.value)
  persistTimer.value = setTimeout(async () => {
    try {
      await useApi(`/admin/courses/${props.courseId}/library-fields`, {
        method: 'PUT',
        body: {
          fields: selected.map(item => ({ id: item.id, sort_order: item.sort_order })),
        },
      })
    } catch (e: any) {
      await dialog.toastError(e?.data?.message || 'Não foi possível salvar os campos da biblioteca.')
    }
  }, 250)
}

function openNew() {
  editingId.value = null
  editingLocalKey.value = null
  resetDraft()
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
  draft.condition_field_id = f.condition_field_id ?? null
  draft.condition_operator = f.condition_operator || 'not_equals'
  draft.condition_value = f.condition_value || ''
  showInlineForm.value = true
}

function cancelInlineForm() {
  showInlineForm.value = false
  editingId.value = null
  editingLocalKey.value = null
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
    condition_field_id: draft.condition_field_id,
    condition_operator: draft.condition_field_id ? draft.condition_operator : null,
    condition_value: draft.condition_field_id ? draft.condition_value : null,
  }
}

async function saveField() {
  if (!draft.label.trim()) {
    await dialog.toastError('Informe o label do campo.')
    return
  }

  saving.value = true

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
        condition_field_id: payload.condition_field_id,
        condition_operator: payload.condition_operator,
        condition_value: payload.condition_value,
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
    await dialog.toastSuccess(props.courseId ? 'Campo salvo.' : 'Campo adicionado.')
  } catch (e: any) {
    await dialog.toastError(e?.data?.message || 'Erro ao salvar campo.')
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
      await dialog.toastError(e?.data?.message || 'Não foi possível remover.')
    }
  } else if (f._localKey) {
    pending.value = pending.value.filter(x => x._localKey !== f._localKey)
  }
}

onMounted(loadFields)
watch(() => props.courseId, loadFields)
</script>
