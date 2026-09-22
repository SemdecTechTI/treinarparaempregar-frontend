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

          <p class="text-sm text-primary bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            Confira se seu cadastro está atualizado.
            <a
              href="/conta/perfil"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-accent underline underline-offset-2 hover:no-underline"
            >Editar cadastro</a>
          </p>

          <div v-if="visibleCustomFields.length" class="space-y-4">
            <p class="text-xs font-semibold text-muted uppercase tracking-wide">Informações adicionais</p>
            <template v-for="field in visibleCustomFields" :key="field.id">
              <DynamicField
                v-if="field.type !== 'file'"
                :field="field"
                v-model="customValues[field.id]"
              />
              <div v-else class="space-y-2">
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
            </template>
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
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                class="input-modern file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-sm"
                :required="doc.required"
                @change="onDocFile(doc, $event)"
              />
              <p class="text-xs text-muted">PDF, JPG ou PNG. Máximo {{ formatMaxUpload(doc.max_kb || 10240) }}.</p>
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
import { formatMaxUpload } from '~/utils/enrollmentDocuments'

const props = defineProps<{
  courseId: number
  courseTitle: string
  customFields: any[]
  documents: Array<{ key: string; label: string; required: boolean; max_kb?: number }>
  linkInscricao?: string | null
  stayOnPage?: boolean
}>()

const emit = defineEmits<{ enrolled: [] }>()

const open = defineModel<boolean>('open', { default: false })

const customValues = ref<Record<number, string>>({})
const docFiles = ref<Record<string, File>>({})
const customFiles = ref<Record<number, File>>({})
const loading = ref(false)
const error = ref('')

const visibleCustomFields = computed(() =>
  props.customFields.filter(field => isFieldVisible(field)),
)

function isFieldVisible(field: any) {
  if (!field.condition_field_id) return true
  const answer = String(customValues.value[field.condition_field_id] || '').trim()
  const expected = String(field.condition_value || '').trim()
  if (field.condition_operator === 'equals') return answer === expected
  if (field.condition_operator === 'not_equals') return answer !== '' && answer !== expected
  return true
}

function onDocFile(doc: { key: string; label: string; max_kb?: number }, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const maxKb = doc.max_kb || 10240
  if (file.size > maxKb * 1024) {
    error.value = `${doc.label} deve ter no máximo ${formatMaxUpload(maxKb)}.`
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  error.value = ''
  docFiles.value[doc.key] = file
}

function onCustomFile(id: number, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) customFiles.value[id] = file
}

async function submit() {
  error.value = ''

  for (const field of visibleCustomFields.value) {
    if (field.type === 'file' && field.required && !customFiles.value[field.id]) {
      error.value = `Campo obrigatório: ${field.label}`
      return
    }
  }
  for (const doc of props.documents) {
    if (doc.required && !docFiles.value[doc.key]) {
      error.value = `Documento obrigatório: ${doc.label}`
      return
    }
  }

  loading.value = true
  try {
    await ensureSanctumCsrf()

    const formData = new FormData()
    formData.append('course_id', String(props.courseId))

    const cfs = visibleCustomFields.value
      .filter(field => field.type !== 'file')
      .map(field => ({
        custom_field_id: field.id,
        value: customValues.value[field.id] || '',
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

    const result = await useApiForm<{ message: string; on_waiting_list?: boolean; link_inscricao?: string }>('/enrollments', formData)
    open.value = false
    emit('enrolled')

    if (result?.on_waiting_list) {
      await useDialog().alert(
        result.message || 'As vagas regulares já foram preenchidas. Você entrou na lista de reserva e será chamado caso surja uma vaga.',
        'Você está na lista de reserva',
        'warning',
      )
    }

    const link = result?.link_inscricao || props.linkInscricao
    if (link) {
      window.location.href = link
      return
    }
    if (!props.stayOnPage) {
      await navigateTo('/conta')
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao inscrever-se.'
  } finally {
    loading.value = false
  }
}
</script>
