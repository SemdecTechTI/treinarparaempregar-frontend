<template>
  <div>
    <AdminHeader :title="course?.titulo || 'Editar curso'" />
    <div v-if="loading" class="text-muted">Carregando...</div>
    <p v-else-if="error && !course" class="text-red-600 text-sm">{{ error }}</p>

    <form v-else-if="course" @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <AdminCourseAdminForm
        :form="form"
        :partners="partners"
        :document-types="documentTypes"
        v-model:selected-docs="selectedDocs"
        :course-id="id"
        :show-enrollment="true"
      />

      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton label="Encerrar inscrições" variant="outline" size="md" :disabled="saving" @click="encerrar" />
        <AdminActionButton to="/admin/cursos" label="Voltar" variant="outline" size="md" />
        <AdminActionButton label="Remover" variant="danger" size="md" :disabled="saving" @click="remove" />
      </div>
      <p v-if="message" class="text-sm text-accent">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const dialog = useDialog()
const id = Number(route.params.id)

const course = ref<any>(null)
const partners = ref<any[]>([])
const documentTypes = ref<Record<string, string>>({})
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')
const selectedDocs = ref<string[]>([])

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

function toLocalInput(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toDateInput(iso: string | null) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

onMounted(async () => {
  try {
    const list = await useApi<any>('/admin/courses')
    documentTypes.value = list.document_types || {}
    partners.value = await useApi<any[]>('/admin/partners')
    course.value = await useApi(`/admin/courses/${id}`)

    form.partner_id = String(course.value.partner_id)
    form.titulo = course.value.titulo
    form.resumo = course.value.resumo || ''
    form.descricao = course.value.descricao || ''
    form.trilha = course.value.trilha
    form.carga_horaria = course.value.carga_horaria || ''
    form.link_inscricao = course.value.link_inscricao || ''
    form.modalidade = course.value.modalidade
    form.imagem = course.value.imagem || ''
    form.ordem = course.value.ordem ?? 0
    form.vagas_totais = course.value.vagas_totais ?? 0
    form.ocultar_vagas_totais = course.value.ocultar_vagas_totais ?? false
    form.ocultar_vagas_disponiveis = course.value.ocultar_vagas_disponiveis ?? true
    form.data_curso = toDateInput(course.value.data_curso)
    form.local = course.value.local || ''
    form.ativo = course.value.ativo
    form.inscricao_inicio = toLocalInput(course.value.inscricao_inicio)
    form.inscricao_fim = toLocalInput(course.value.inscricao_fim)
    form.inscricao_encerrada = course.value.inscricao_encerrada ?? false
    form.permite_inscricao_simultanea = course.value.permite_inscricao_simultanea ?? false
    form.exige_documentos = course.value.exige_documentos ?? false
    selectedDocs.value = (course.value.documentos_necessarios || []).map((d: any) => d.key || d)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar curso.'
  } finally {
    loading.value = false
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
    await useApi(`/admin/courses/${id}`, {
      method: 'PUT',
      body: {
        ...form,
        partner_id: Number(form.partner_id),
        ordem: Number(form.ordem) || 0,
        vagas_totais: Number(form.vagas_totais) || 0,
        data_curso: form.data_curso || null,
        inscricao_inicio: form.inscricao_inicio || null,
        inscricao_fim: form.inscricao_fim || null,
        documentos_necessarios: form.exige_documentos ? documentos_necessarios : [],
      },
    })
    message.value = 'Curso atualizado com sucesso.'
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function encerrar() {
  saving.value = true
  await useApi(`/admin/courses/${id}/encerrar-inscricao`, { method: 'POST' })
  form.inscricao_encerrada = true
  message.value = 'Inscrições encerradas.'
  saving.value = false
}

async function remove() {
  if (!await dialog.confirm(`Remover o curso "${course.value?.titulo}"?`, {
    title: 'Remover curso',
    confirmText: 'Remover',
    danger: true,
  })) return
  saving.value = true
  error.value = ''
  try {
    await useApi(`/admin/courses/${id}`, { method: 'DELETE' })
    await navigateTo('/admin/cursos')
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível remover.'
    saving.value = false
  }
}
</script>
