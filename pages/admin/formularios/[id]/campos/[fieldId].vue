<template>
  <div>
    <AdminHeader title="Editar pergunta" />
    <div v-if="loading" class="text-muted">Carregando...</div>
    <form v-else-if="field" @submit.prevent="save" class="max-w-2xl mx-auto space-y-6">
      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label class="form-label">Tipo</label>
          <select v-model="form.type" class="input-modern">
            <option v-for="(label, key) in fieldTypes" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label class="form-label">Título</label>
          <input v-model="form.label" type="text" required class="input-modern" />
        </div>
        <div>
          <label class="form-label">Descrição</label>
          <textarea v-model="form.description" rows="3" class="input-modern" />
        </div>
        <div v-if="hasOptions">
          <label class="form-label">Opções (uma por linha)</label>
          <textarea v-model="form.options_text" rows="5" class="input-modern" />
        </div>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.required" type="checkbox" :disabled="form.type === 'static_text'" />
          Obrigatório
        </label>
        <div class="border-t pt-4 space-y-3">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.conditional_enabled" type="checkbox" />
            Exibir condicionalmente
          </label>
          <template v-if="form.conditional_enabled">
            <div>
              <label class="form-label">Campo de referência</label>
              <select v-model="form.conditional_field_id" class="input-modern">
                <option value="">Selecione...</option>
                <option v-for="f in otherFields" :key="f.id" :value="f.id">{{ f.label }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Condição</label>
              <select v-model="form.conditional_operator" class="input-modern">
                <option v-for="(label, key) in operators" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div v-if="needsValue">
              <label class="form-label">Valor esperado</label>
              <input v-model="form.conditional_value" type="text" class="input-modern" />
            </div>
          </template>
        </div>
      </div>
      <div class="flex gap-3">
        <AdminActionButton label="Salvar" variant="primary" size="md" submit />
        <AdminActionButton :to="`/admin/formularios/${formId}/campos`" label="Voltar" variant="outline" size="md" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'forms' })

const route = useRoute()
const formId = Number(route.params.id)
const fieldId = Number(route.params.fieldId)

const field = ref<any>(null)
const allFields = ref<any[]>([])
const fieldTypes = ref<Record<string, string>>({})
const operators = ref<Record<string, string>>({})
const loading = ref(true)
const error = ref('')

const form = reactive({
  type: 'text',
  label: '',
  description: '',
  options_text: '',
  required: false,
  conditional_enabled: false,
  conditional_field_id: '' as string | number,
  conditional_operator: 'filled',
  conditional_value: '',
})

const hasOptions = computed(() => ['radio', 'checkbox', 'select', 'scale'].includes(form.type))
const needsValue = computed(() => ['equals', 'not_equals'].includes(form.conditional_operator))
const otherFields = computed(() =>
  allFields.value.filter((f) => f.id !== fieldId && f.type !== 'static_text'),
)

onMounted(async () => {
  try {
    const meta = await useApi<any>('/admin/forms/meta')
    fieldTypes.value = meta.field_types || {}
    operators.value = meta.conditional_operators || {}
    const data = await useApi<any>(`/admin/forms/${formId}`)
    allFields.value = data.fields || []
    field.value = allFields.value.find((f: any) => f.id === fieldId)
    if (!field.value) throw new Error('not found')
    form.type = field.value.type
    form.label = field.value.label
    form.description = field.value.description || ''
    form.options_text = field.value.options_text || ''
    form.required = field.value.required
    if (field.value.conditional) {
      form.conditional_enabled = true
      form.conditional_field_id = field.value.conditional.field_id
      form.conditional_operator = field.value.conditional.operator
      form.conditional_value = field.value.conditional.value || ''
    }
  } catch {
    error.value = 'Pergunta não encontrada.'
  } finally {
    loading.value = false
  }
})

async function save() {
  error.value = ''
  try {
    await useApi(`/admin/forms/${formId}/fields/${fieldId}`, {
      method: 'PUT',
      body: {
        ...form,
        conditional_field_id: form.conditional_enabled ? Number(form.conditional_field_id) : null,
      },
    })
    await navigateTo(`/admin/formularios/${formId}/campos`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao salvar.'
  }
}
</script>
