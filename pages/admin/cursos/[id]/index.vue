<template>
  <div>
    <AdminHeader :title="course?.title || 'Editar curso'" />
    <div v-if="loading" class="text-muted">Carregando...</div>
    <p v-else-if="error && !course" class="text-red-600 text-sm">{{ error }}</p>

    <form v-else-if="course" @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <AdminCourseAdminForm
        :form="form"
        :partners="partners"
        :tracks="tracks"
        :document-types="documentTypes"
        v-model:selected-docs="selectedDocs"
        :course-id="id"
        :show-enrollment="true"
        :linked-courses="linkedCourses"
        :course-options="courseOptions"
        :link-source="linkSource"
        @partner-created="onPartnerCreated"
      />

      <div v-if="form.modality === 'online'" class="bg-white rounded-lg shadow p-6">
        <AdminCourseVideosPanel :course-id="id" />
      </div>

      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton label="Encerrar inscrições" variant="outline" size="md" :disabled="saving" @click="encerrar" />
        <AdminActionButton
          :label="course.active ? 'Inativar curso' : 'Ativar curso'"
          variant="outline"
          size="md"
          :disabled="saving"
          @click="toggleActive"
        />
        <AdminActionButton to="/admin/cursos" label="Voltar" variant="outline" size="md" />
        <AdminActionButton label="Remover" variant="danger" size="md" :disabled="saving" @click="remove" />
      </div>
      <p v-if="message" class="text-sm text-accent">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'courses' })

const route = useRoute()
const dialog = useDialog()
const id = Number(route.params.id)

const course = ref<any>(null)
const partners = ref<any[]>([])
const tracks = ref<Array<{ id: number; name: string; slug: string; active?: boolean }>>([])
const allCourses = ref<any[]>([])
const documentTypes = ref<Record<string, string>>({})
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')
const selectedDocs = ref<string[]>([])
const linkSource = ref<{ id: number; title: string; internal_title?: string | null } | null>(null)

const linkedCourses = computed(() => course.value?.linked_courses || [])
const courseOptions = computed(() =>
  allCourses.value
    .filter((c: any) => c.id !== id)
    .map((c: any) => ({ id: c.id, title: c.title, internal_title: c.internal_title })),
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
    allCourses.value = list.courses || []
    partners.value = await useApi<any[]>('/admin/partners')
    tracks.value = await useApi('/admin/tracks')
    course.value = await useApi(`/admin/courses/${id}`)

    form.partner_id = String(course.value.partner_id)
    form.title = course.value.title
    form.internal_title = course.value.internal_title || ''
    form.summary = course.value.summary || ''
    form.description = course.value.description || ''
    form.track = course.value.track
    form.workload = course.value.workload || ''
    form.enrollment_link = course.value.enrollment_link || ''
    form.modality = course.value.modality
    form.image = course.value.image || ''
    form.sort_order = course.value.sort_order ?? 0
    form.total_vacancies = course.value.total_vacancies ?? 0
    form.reserve_vacancies = course.value.reserve_vacancies ?? 0
    form.hide_total_vacancies = course.value.hide_total_vacancies ?? false
    form.hide_available_vacancies = course.value.hide_available_vacancies ?? true
    form.course_start_date = toDateInput(course.value.course_start_date)
    form.course_end_date = toDateInput(course.value.course_end_date)
    form.location = course.value.location || ''
    form.listed = course.value.listed ?? true
    form.women_only = course.value.women_only ?? false
    form.adults_only = course.value.adults_only ?? false
    form.enrollment_start = toLocalInput(course.value.enrollment_start)
    form.enrollment_end = toLocalInput(course.value.enrollment_end)
    form.enrollment_closed = course.value.enrollment_closed ?? false
    form.allow_simultaneous_enrollment = course.value.allow_simultaneous_enrollment ?? false
    form.requires_documents = course.value.requires_documents ?? false
    form.keep_export_link = !!(course.value.export_group_id || course.value.linked_courses?.length)
    form.link_course_id = ''
    selectedDocs.value = (course.value.required_documents || []).map((d: any) => d.key || d)

    const linkFrom = Number(route.query.link_from || 0)
    if (linkFrom && course.value.export_group_id) {
      const source = allCourses.value.find((c: any) => c.id === linkFrom)
      if (source) {
        linkSource.value = { id: source.id, title: source.title, internal_title: source.internal_title }
        form.keep_export_link = true
      }
    } else if (course.value.linked_courses?.length) {
      form.keep_export_link = true
    }
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
    const required_documents = selectedDocs.value.map(key => ({
      key,
      label: documentTypes.value[key],
      required: true,
    }))
    const body: Record<string, unknown> = {
      partner_id: Number(form.partner_id),
      title: form.title,
      internal_title: form.internal_title || null,
      summary: form.summary,
      description: form.description,
      track: form.track,
      workload: form.workload,
      enrollment_link: form.enrollment_link,
      modality: form.modality,
      image: form.image,
      sort_order: Number(form.sort_order) || 0,
      total_vacancies: Number(form.total_vacancies) || 0,
      reserve_vacancies: Number(form.reserve_vacancies) || 0,
      hide_total_vacancies: form.hide_total_vacancies,
      hide_available_vacancies: form.hide_available_vacancies,
      course_start_date: form.course_start_date || null,
      course_end_date: form.course_end_date || null,
      location: form.location,
      listed: form.listed,
      women_only: form.women_only,
      adults_only: form.adults_only,
      enrollment_start: form.enrollment_start || null,
      enrollment_end: form.enrollment_end || null,
      enrollment_closed: form.enrollment_closed,
      allow_simultaneous_enrollment: form.allow_simultaneous_enrollment,
      requires_documents: form.requires_documents,
      required_documents: form.requires_documents ? required_documents : [],
      keep_export_link: form.keep_export_link,
    }

    if (!form.keep_export_link && course.value?.export_group_id) {
      body.unlink_export_group = true
    } else if (form.keep_export_link && form.link_course_id) {
      body.link_course_id = Number(form.link_course_id)
    }

    const updated = await useApi<any>(`/admin/courses/${id}`, { method: 'PUT', body })
    course.value = updated
    form.keep_export_link = !!(updated.export_group_id || updated.linked_courses?.length)
    form.link_course_id = ''
    linkSource.value = null
    message.value = 'Curso atualizado com sucesso.'
    if (route.query.link_from) {
      await navigateTo({ path: `/admin/cursos/${id}`, query: {} }, { replace: true })
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function encerrar() {
  saving.value = true
  await useApi(`/admin/courses/${id}/close-enrollment`, { method: 'POST' })
  form.enrollment_closed = true
  message.value = 'Inscrições encerradas.'
  saving.value = false
}

async function toggleActive() {
  const activating = !course.value?.active
  if (!await dialog.confirm(
    activating
      ? `Ativar o curso "${course.value?.title}"? Ele voltará a ficar acessível pela URL.`
      : `Inativar o curso "${course.value?.title}"? Ele some da listagem e a URL deixa de funcionar.`,
    {
      title: activating ? 'Ativar curso' : 'Inativar curso',
      confirmText: activating ? 'Ativar' : 'Inativar',
      danger: !activating,
    },
  )) return

  saving.value = true
  error.value = ''
  try {
    const res = await useApi<any>(`/admin/courses/${id}/toggle-active`, { method: 'POST' })
    course.value = { ...course.value, active: res.course?.active ?? !course.value.active }
    message.value = res.message || (course.value.active ? 'Curso ativado.' : 'Curso inativado.')
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível alterar o status do curso.'
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!await dialog.confirm(`Remover o curso "${course.value?.title}"? Esta ação pode ser revertida pelo suporte.`, {
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
