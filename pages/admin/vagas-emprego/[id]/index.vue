<template>
  <div>
    <AdminHeader :title="vacancy?.job_title || 'Detalhe da vaga'">
      <AdminActionButton to="/admin/vagas-emprego" label="Voltar" variant="outline" size="md" />
    </AdminHeader>

    <p v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</p>

    <div v-if="vacancy" class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm text-muted">Status interno</p>
          <div class="mt-1"><JobVacancyStatusBadge :status="vacancy.status" /></div>
          <p v-if="vacancy.company" class="text-sm mt-3">
            Empresa:
            <NuxtLink :to="`/admin/empresas/${vacancy.company_id}`" class="text-accent font-medium hover:underline">
              {{ vacancy.company.legal_name }}
            </NuxtLink>
          </p>
        </div>
        <div class="flex flex-wrap gap-2 max-w-xl w-full sm:w-auto">
          <select v-model="statusForm.status" class="input-modern">
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Recusado</option>
          </select>
          <input v-model="statusForm.status_note" class="input-modern flex-1 min-w-[180px]" placeholder="Nota interna (opcional)" />
          <AdminActionButton label="Atualizar status" variant="primary" size="md" :disabled="savingStatus" @click="saveStatus" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 space-y-4 text-sm">
        <h2 class="font-semibold text-primary text-base">Dados da vaga</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in detailFields" :key="item.label" :class="item.full ? 'md:col-span-2' : ''">
            <p class="text-xs text-muted mb-0.5">{{ item.label }}</p>
            <p class="text-text whitespace-pre-wrap">{{ item.value }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <AdminActionButton label="Remover vaga" variant="danger" size="md" @click="remove" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobVacancy } from '~/types/company-job-vacancy'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'job_vacancies' })

const route = useRoute()
const id = computed(() => Number(route.params.id))
const vacancy = ref<JobVacancy | null>(null)
const loadError = ref('')
const savingStatus = ref(false)
const dialog = useDialog()
const statusForm = reactive({ status: 'pending', status_note: '' })

const detailFields = computed(() => {
  const v = vacancy.value
  if (!v) return []
  return [
    { label: 'Função', value: v.job_title },
    { label: 'Quantidade', value: String(v.openings_count) },
    { label: 'Tipo', value: v.vacancy_type },
    { label: 'Salário', value: v.salary || 'A combinar' },
    { label: 'Escolaridade', value: v.education_level },
    { label: 'Curso', value: v.course_requirement },
    { label: 'Experiência', value: v.experience_time || 'Não exige' },
    { label: 'Habilitação', value: v.driver_license || '—' },
    { label: 'Veículo', value: v.vehicle_required == null ? '—' : (v.vehicle_required ? 'Sim' : 'Não') },
    { label: 'Horário', value: v.work_schedule },
    { label: 'Dias', value: v.work_days },
    { label: 'Aceita PCD', value: v.accepts_pwd ? 'Sim' : 'Não' },
    { label: 'Atividades', value: v.activities, full: true },
    { label: 'Benefícios', value: (v.benefits || []).join(', ') || '—', full: true },
    { label: 'Outros benefícios', value: v.other_benefits || '—', full: true },
    { label: 'Comprovação', value: (v.proof_types || []).join(', ') || '—', full: true },
    { label: 'Habilidades', value: v.skills || '—', full: true },
    { label: 'Tipos de deficiência', value: (v.disability_types || []).join(', ') || '—', full: true },
    { label: 'Justificativa PCD', value: v.pwd_justification || '—', full: true },
    { label: 'Data seleção', value: String(v.selection_date || '—') },
    { label: 'Horário seleção', value: v.selection_time },
    { label: 'Endereço seleção', value: v.selection_address, full: true },
    { label: 'Responsável seleção', value: v.selection_contact, full: true },
    { label: 'Observações', value: v.notes || '—', full: true },
    { label: 'Nota interna', value: v.status_note || '—', full: true },
  ]
})

async function load() {
  try {
    vacancy.value = await useApi<JobVacancy>(`/admin/job-vacancies/${id.value}`)
    statusForm.status = vacancy.value.status
    statusForm.status_note = vacancy.value.status_note || ''
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar vaga.'
  }
}

async function saveStatus() {
  savingStatus.value = true
  try {
    vacancy.value = await useApi<JobVacancy>(`/admin/job-vacancies/${id.value}/status`, {
      method: 'PUT',
      body: { ...statusForm },
    })
    await dialog.toastSuccess('Status atualizado.')
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Erro ao atualizar status.')
  } finally {
    savingStatus.value = false
  }
}

async function remove() {
  if (!await dialog.confirm('Remover esta vaga?', { title: 'Remover', confirmText: 'Remover', danger: true })) return
  try {
    await useApi(`/admin/job-vacancies/${id.value}`, { method: 'DELETE' })
    await navigateTo('/admin/vagas-emprego')
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Erro ao remover.')
  }
}

onMounted(load)
</script>
