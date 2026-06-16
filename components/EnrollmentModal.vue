<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="open = false" />
      <div class="relative bg-white rounded-2xl shadow-card-hover w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 class="font-semibold text-primary">Inscrição no curso</h3>
          <button type="button" class="text-muted hover:text-text p-1" @click="open = false">✕</button>
        </div>

        <form class="p-6 space-y-5" @submit.prevent="submit">
          <p class="text-sm text-muted">{{ courseTitle }}</p>

          <div v-if="customFields.length" class="space-y-4">
            <p class="text-xs font-semibold text-muted uppercase tracking-wide">Informações adicionais</p>
            <DynamicField
              v-for="field in customFields.filter(f => f.type !== 'file')"
              :key="field.id"
              :field="field"
              v-model="customValues[field.id]"
            />
            <div v-for="field in customFields.filter(f => f.type === 'file')" :key="field.id" class="space-y-2">
              <label class="form-label">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <input
                type="file"
                class="input-modern file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-sm"
                :required="field.required"
                @change="onCustomFile(field.id, $event)"
              />
            </div>
          </div>

          <div v-if="documents.length" class="space-y-4">
            <p class="text-xs font-semibold text-muted uppercase tracking-wide">Documentos</p>
            <p class="text-xs text-muted">Envie os arquivos solicitados para confirmar sua inscrição.</p>
            <div v-for="doc in documents" :key="doc.key" class="space-y-2">
              <label class="form-label">
                {{ doc.label }}
                <span v-if="doc.required" class="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                class="input-modern file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-sm"
                :required="doc.required"
                @change="onDocFile(doc.key, $event)"
              />
            </div>
          </div>

          <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{{ error }}</p>

          <div class="flex gap-3 pt-2">
            <button type="button" class="btn btn-outline flex-1 py-3 rounded-xl" @click="open = false">Cancelar</button>
            <button type="submit" class="btn flex-1 py-3 rounded-xl" :disabled="loading">
              {{ loading ? 'Enviando...' : 'Confirmar inscrição' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  courseId: number
  courseTitle: string
  customFields: any[]
  documents: Array<{ key: string; label: string; required: boolean }>
  linkInscricao?: string | null
}>()

const open = defineModel<boolean>('open', { default: false })

const customValues = ref<Record<number, string>>({})
const docFiles = ref<Record<string, File>>({})
const customFiles = ref<Record<number, File>>({})
const loading = ref(false)
const error = ref('')

function onDocFile(key: string, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) docFiles.value[key] = file
}

function onCustomFile(id: number, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) customFiles.value[id] = file
}

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await ensureSanctumCsrf()

    const formData = new FormData()
    formData.append('course_id', String(props.courseId))

    const cfs = Object.entries(customValues.value).map(([id, value]) => ({
      custom_field_id: Number(id),
      value,
    }))
    cfs.forEach((cf, i) => {
      formData.append(`custom_fields[${i}][custom_field_id]`, String(cf.custom_field_id))
      formData.append(`custom_fields[${i}][value]`, cf.value || '')
    })

    Object.entries(docFiles.value).forEach(([key, file]) => {
      formData.append(`documents[${key}]`, file)
    })

    Object.entries(customFiles.value).forEach(([id, file]) => {
      formData.append(`custom_field_files[${id}]`, file)
    })

    const result = await useApiForm<{ message: string; link_inscricao?: string }>('/enrollments', formData)
    open.value = false
    const link = result?.link_inscricao || props.linkInscricao
    if (link) {
      window.location.href = link
      return
    }
    await navigateTo('/conta')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao inscrever-se.'
  } finally {
    loading.value = false
  }
}
</script>
