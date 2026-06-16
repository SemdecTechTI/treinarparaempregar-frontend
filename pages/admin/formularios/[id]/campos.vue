<template>
  <div>
    <AdminHeader :title="form?.title ? `Perguntas: ${form.title}` : 'Perguntas'">
      <AdminActionButton :to="`/admin/formularios/${id}`" label="Ajustes" variant="outline" size="md" />
    </AdminHeader>

    <div v-if="loading" class="text-muted">Carregando...</div>
    <template v-else-if="form">
      <AdminFormPanel title="Nova pergunta" class="mb-6">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Tipo</label>
            <select v-model="newField.type" class="input-modern" @change="onTypeChange">
              <option v-for="(label, key) in fieldTypes" :key="key" :value="key">{{ label }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">Título / label</label>
            <input v-model="newField.label" type="text" class="input-modern" required />
          </div>
          <div class="md:col-span-2">
            <label class="form-label">Descrição / ajuda</label>
            <textarea v-model="newField.description" rows="2" class="input-modern" />
          </div>
          <div v-if="hasOptions" class="md:col-span-2">
            <label class="form-label">Opções (uma por linha)</label>
            <textarea v-model="newField.options_text" rows="4" class="input-modern" placeholder="Opção 1&#10;Opção 2" />
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="newField.required" type="checkbox" :disabled="newField.type === 'static_text'" />
            Obrigatório
          </label>
        </div>
        <div class="mt-4 flex gap-3">
          <AdminActionButton label="Adicionar pergunta" variant="primary" size="md" :disabled="creating" @click="createField" />
        </div>
        <p v-if="createError" class="text-sm text-red-600 mt-2">{{ createError }}</p>
      </AdminFormPanel>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">Pergunta</th>
              <th class="px-4 py-3 text-left">Tipo</th>
              <th class="px-4 py-3 text-left">Obrig.</th>
              <th class="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!fields.length" class="border-t">
              <td colspan="4" class="px-4 py-8 text-center text-muted">Nenhuma pergunta ainda.</td>
            </tr>
            <tr v-for="f in fields" :key="f.id" class="border-t">
              <td class="px-4 py-3 font-medium">{{ f.label }}</td>
              <td class="px-4 py-3">{{ f.type_label }}</td>
              <td class="px-4 py-3">{{ f.required ? 'Sim' : '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2 items-center">
                  <button type="button" class="text-xs text-muted hover:text-primary" @click="move(f, 'up')">↑</button>
                  <button type="button" class="text-xs text-muted hover:text-primary" @click="move(f, 'down')">↓</button>
                  <AdminRowActionsMenu :items="[
                    { label: 'Editar', to: `/admin/formularios/${id}/campos/${f.id}` },
                    { label: 'Remover', danger: true, onClick: () => removeField(f) },
                  ]" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const dialog = useDialog()
const id = Number(route.params.id)

const form = ref<any>(null)
const fields = ref<any[]>([])
const fieldTypes = ref<Record<string, string>>({})
const loading = ref(true)
const creating = ref(false)
const createError = ref('')

const newField = reactive({
  type: 'text',
  label: '',
  description: '',
  options_text: '',
  required: false,
})

const hasOptions = computed(() =>
  ['radio', 'checkbox', 'select', 'scale'].includes(newField.type),
)

function onTypeChange() {
  if (newField.type === 'static_text') newField.required = false
  if (newField.type === 'scale' && !newField.options_text) {
    newField.options_text = '1\n2\n3\n4\n5'
  }
}

onMounted(async () => {
  try {
    const meta = await useApi<any>('/admin/forms/meta')
    fieldTypes.value = meta.field_types || {}
    form.value = await useApi(`/admin/forms/${id}`)
    fields.value = form.value.fields || []
  } finally {
    loading.value = false
  }
})

async function createField() {
  creating.value = true
  createError.value = ''
  try {
    const field = await useApi<any>(`/admin/forms/${id}/fields`, {
      method: 'POST',
      body: { ...newField },
    })
    fields.value.push(field)
    newField.label = ''
    newField.description = ''
    newField.options_text = ''
    newField.required = false
  } catch (e: any) {
    createError.value = e?.data?.message || 'Erro ao criar pergunta.'
  } finally {
    creating.value = false
  }
}

async function move(f: any, direction: 'up' | 'down') {
  await useApi(`/admin/forms/${id}/fields/${f.id}/move`, {
    method: 'POST',
    body: { direction },
  })
  form.value = await useApi(`/admin/forms/${id}`)
  fields.value = form.value.fields || []
}

async function removeField(f: any) {
  if (!await dialog.confirm(`Remover a pergunta "${f.label}"?`, {
    title: 'Remover pergunta',
    confirmText: 'Remover',
    danger: true,
  })) return
  await useApi(`/admin/forms/${id}/fields/${f.id}`, { method: 'DELETE' })
  fields.value = fields.value.filter((x) => x.id !== f.id)
}
</script>
