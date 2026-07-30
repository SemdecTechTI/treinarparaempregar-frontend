<template>
  <div>
    <AdminHeader title="Novo curso" />
    <form @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <AdminCourseAdminForm
        :form="form"
        :partners="partners"
        :tracks="tracks"
        :document-types="documentTypes"
        v-model:selected-docs="selectedDocs"
        v-model:pending-custom-fields="pendingCustomFields"
        :show-enrollment="true"
        :course-options="courseOptions"
        @partner-created="onPartnerCreated"
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

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'courses' })

const partners = ref<any[]>([])
const tracks = ref<Array<{ id: number; name: string; slug: string }>>([])
const allCourses = ref<any[]>([])
const documentTypes = ref<Record<string, string>>({})
const selectedDocs = ref<string[]>([])
const pendingCustomFields = ref<CourseCustomFieldDraft[]>([])
const saving = ref(false)
const message = ref('')
const error = ref('')

const courseOptions = computed(() =>
  allCourses.value.map((c: any) => ({ id: c.id, title: c.title, internal_title: c.internal_title })),
)

function onPartnerCreated(partner: { id: number; name: string }) {
  if (!partners.value.some(p => p.id === partner.id)) {
    partners.value = [...partners.value, partner].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }
  form.partner_id = String(partner.id)
}

const form = reactive({
  partner_id: '',
  title: '',
  internal_title: '',
  summary: '',
  description: '',
  track: 'base',
  workload: '',
  enrollment_link: '',
  modality: 'presencial',
  image: '',
  sort_order: 0,
  total_vacancies: 0,
  reserve_vacancies: 0,
  hide_total_vacancies: false,
  hide_available_vacancies: true,
  course_start_date: '',
  course_end_date: '',
  location: '',
  listed: true,
  women_only: false,
  adults_only: false,
  enrollment_start: '',
  enrollment_end: '',
  enrollment_closed: false,
  allow_simultaneous_enrollment: false,
  requires_documents: false,
  keep_export_link: true,
  link_course_id: '',
})

onMounted(async () => {
  try {
    const list = await useApi<any>('/admin/courses')
    documentTypes.value = list.document_types || {}
    allCourses.value = list.courses || []
    partners.value = await useApi<any[]>('/admin/partners')
    tracks.value = await useApi('/admin/tracks')
    if (partners.value.length) form.partner_id = String(partners.value[0].id)
    if (tracks.value.length && !tracks.value.some(t => t.slug === form.track)) {
      form.track = tracks.value[0].slug
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar dados do formulário.'
  }
})

async function save() {
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    const required_documents = selectedDocs.value.map(key => ({
      key,
      label: documentTypes.value[key],
      required: true,
    }))
    const body: Record<string, unknown> = {
      ...form,
      partner_id: Number(form.partner_id),
      sort_order: Number(form.sort_order) || 0,
      total_vacancies: Number(form.total_vacancies) || 0,
      reserve_vacancies: Number(form.reserve_vacancies) || 0,
      course_start_date: form.course_start_date || null,
      course_end_date: form.course_end_date || null,
      enrollment_start: form.enrollment_start || null,
      enrollment_end: form.enrollment_end || null,
      internal_title: form.internal_title || null,
      required_documents: form.requires_documents ? required_documents : [],
      link_course_id: form.link_course_id ? Number(form.link_course_id) : null,
    }
    const created = await useApi<any>('/admin/courses', { method: 'POST', body })
    for (const f of pendingCustomFields.value) {
      await useApi('/admin/custom-fields', {
        method: 'POST',
        body: {
          course_id: created.id,
          label: f.label,
          type: f.type,
          sort_order: f.sort_order ?? 0,
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
