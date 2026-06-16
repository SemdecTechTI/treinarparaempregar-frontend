<template>
  <div>
    <AdminHeader title="Novo curso" />
    <form @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <AdminCourseAdminForm
        :form="form"
        :partners="partners"
        :document-types="documentTypes"
        v-model:selected-docs="selectedDocs"
        v-model:pending-custom-fields="pendingCustomFields"
        :show-enrollment="true"
      />

      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Criando...' : 'Criar curso'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton to="/admin/cursos" label="Voltar" variant="outline" size="md" />
      </div>
      <p v-if="message" class="text-sm text-accent">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CourseCustomFieldDraft } from '~/types/custom-field'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const partners = ref<any[]>([])
const documentTypes = ref<Record<string, string>>({})
const selectedDocs = ref<string[]>([])
const pendingCustomFields = ref<CourseCustomFieldDraft[]>([])
const saving = ref(false)
const message = ref('')
const error = ref('')

const form = reactive({
  partner_id: '',
  titulo: '',
  resumo: '',
  descricao: '',
  trilha: 'base',
  carga_horaria: '',
  link_inscricao: '',
  modalidade: 'presencial',
  imagem: '',
  ordem: 0,
  vagas_totais: 0,
  ocultar_vagas_totais: false,
  ocultar_vagas_disponiveis: true,
  data_curso: '',
  local: '',
  ativo: true,
  inscricao_inicio: '',
  inscricao_fim: '',
  inscricao_encerrada: false,
  permite_inscricao_simultanea: false,
  exige_documentos: false,
})

onMounted(async () => {
  try {
    const list = await useApi<any>('/admin/courses')
    documentTypes.value = list.document_types || {}
    partners.value = await useApi<any[]>('/admin/partners')
    if (partners.value.length) form.partner_id = String(partners.value[0].id)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar dados do formulário.'
  }
})

async function save() {
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    const documentos_necessarios = selectedDocs.value.map(key => ({
      key,
      label: documentTypes.value[key],
      required: true,
    }))
    const body: Record<string, unknown> = {
      ...form,
      partner_id: Number(form.partner_id),
      ordem: Number(form.ordem) || 0,
      vagas_totais: Number(form.vagas_totais) || 0,
      data_curso: form.data_curso || null,
      inscricao_inicio: form.inscricao_inicio || null,
      inscricao_fim: form.inscricao_fim || null,
      documentos_necessarios: form.exige_documentos ? documentos_necessarios : [],
    }
    const created = await useApi<any>('/admin/courses', { method: 'POST', body })
    for (const f of pendingCustomFields.value) {
      await useApi('/admin/custom-fields', {
        method: 'POST',
        body: {
          course_id: created.id,
          label: f.label,
          type: f.type,
          ordem: f.ordem ?? 0,
          required: f.required ?? false,
          options: f.options,
        },
      })
    }
    await navigateTo(`/admin/cursos/${created.id}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao criar curso.'
  } finally {
    saving.value = false
  }
}
</script>
