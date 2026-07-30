<template>
  <div>
    <AdminHeader title="Vagas de emprego">
      <AdminExportButton
        endpoint="/admin/exports/job-vacancies"
        filename="vagas_emprego"
        :filters="exportFilters"
      />
    </AdminHeader>

    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="q"
        type="search"
        class="input-modern max-w-sm"
        placeholder="Buscar função ou empresa"
        @keyup.enter="load(1)"
      />
      <select v-model="status" class="input-modern max-w-[180px]" @change="load(1)">
        <option value="">Todos os status</option>
        <option value="pending">Pendente</option>
        <option value="approved">Aprovado</option>
        <option value="rejected">Recusado</option>
      </select>
      <AdminActionButton label="Buscar" variant="outline" size="md" @click="load(1)" />
    </div>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Função</th>
            <th class="px-4 py-3 text-left">Empresa</th>
            <th class="px-4 py-3 text-left">Qtd</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Enviada em</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length" class="border-t">
            <td colspan="6" class="px-4 py-6 text-center text-muted">Nenhuma vaga encontrada.</td>
          </tr>
          <tr v-for="item in rows" :key="item.id" class="border-t">
            <td class="px-4 py-3 font-medium text-primary">{{ item.job_title }}</td>
            <td class="px-4 py-3">
              <p>{{ item.company?.trade_name || item.company?.legal_name || '—' }}</p>
              <p class="text-xs text-muted">{{ item.company ? formatCnpj(item.company.cnpj) : '' }}</p>
            </td>
            <td class="px-4 py-3">{{ item.openings_count }}</td>
            <td class="px-4 py-3"><JobVacancyStatusBadge :status="item.status" /></td>
            <td class="px-4 py-3">{{ formatDate(item.created_at) }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Abrir', onClick: () => navigateTo(`/admin/vagas-emprego/${item.id}`) },
                ...(item.company_id ? [{ label: 'Ver empresa', onClick: () => navigateTo(`/admin/empresas/${item.company_id}`) }] : []),
              ]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="lastPage > 1" class="flex gap-2 mt-4">
      <AdminActionButton label="Anterior" variant="outline" size="sm" :disabled="page <= 1" @click="load(page - 1)" />
      <span class="text-sm text-muted self-center">Página {{ page }} de {{ lastPage }}</span>
      <AdminActionButton label="Próxima" variant="outline" size="sm" :disabled="page >= lastPage" @click="load(page + 1)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobVacancy } from '~/types/company-job-vacancy'
import { formatCnpj } from '~/utils/cnpj'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'job_vacancies' })

const route = useRoute()
const rows = ref<JobVacancy[]>([])
const loadError = ref('')
const q = ref('')
const status = ref('')
const page = ref(1)
const lastPage = ref(1)
const companyIdFilter = computed(() => route.query.company_id ? String(route.query.company_id) : '')

const exportFilters = computed(() => ({
  q: q.value || undefined,
  status: status.value || undefined,
  company_id: companyIdFilter.value || undefined,
}))

async function load(p = 1) {
  try {
    const params = new URLSearchParams({ page: String(p), per_page: '20' })
    if (q.value.trim()) params.set('q', q.value.trim())
    if (status.value) params.set('status', status.value)
    if (companyIdFilter.value) params.set('company_id', companyIdFilter.value)
    const data = await useApi<any>(`/admin/job-vacancies?${params}`)
    rows.value = data.data || data
    page.value = data.current_page || p
    lastPage.value = data.last_page || 1
    loadError.value = ''
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar vagas.'
  }
}

function formatDate(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

onMounted(() => load(1))
watch(() => route.query.company_id, () => load(1))
</script>
