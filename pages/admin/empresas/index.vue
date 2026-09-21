<template>
  <div>
    <AdminHeader title="Empresas">
      <AdminExportButton
        endpoint="/admin/exports/companies"
        filename="empresas"
        :filters="{ q: q || undefined, campaign: campaign || undefined }"
      />
    </AdminHeader>

    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="q"
        type="search"
        class="input-modern max-w-sm"
        placeholder="Buscar por nome, CNPJ ou e-mail"
        @keyup.enter="load(1)"
      />
      <select v-model="campaign" class="input-modern max-w-[220px]" @change="load(1)">
        <option value="">Todas as origens</option>
        <option value="sem-campanha">Sem campanha</option>
        <option v-for="item in campaigns" :key="item" :value="item">{{ item }}</option>
      </select>
      <AdminActionButton label="Buscar" variant="outline" size="md" @click="load(1)" />
    </div>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Empresa</th>
            <th class="px-4 py-3 text-left">CNPJ</th>
            <th class="px-4 py-3 text-left">Contato</th>
            <th class="px-4 py-3 text-left">Campanha</th>
            <th class="px-4 py-3 text-left">Vagas</th>
            <th class="px-4 py-3 text-left whitespace-nowrap">Cadastro</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length" class="border-t">
            <td colspan="7" class="px-4 py-6 text-center text-muted">Nenhuma empresa cadastrada.</td>
          </tr>
          <tr v-for="item in rows" :key="item.id" class="border-t">
            <td class="px-4 py-3">
              <p class="font-medium text-primary">{{ item.legal_name }}</p>
              <p class="text-xs text-muted">{{ item.trade_name }}</p>
              <p v-if="item.profile_completed === false" class="text-[11px] text-amber-700 font-semibold mt-1">Cadastro incompleto</p>
            </td>
            <td class="px-4 py-3">{{ formatCnpj(item.cnpj) }}</td>
            <td class="px-4 py-3">
              <p>{{ item.contact_name }}</p>
              <p class="text-xs text-muted">{{ item.email }}</p>
            </td>
            <td class="px-4 py-3">
              <span
                v-if="item.campaign"
                class="inline-flex items-center rounded-full bg-accent/10 text-accent px-2 py-0.5 text-xs font-semibold"
              >
                {{ item.campaign }}
              </span>
              <p v-if="item.utm_source || item.utm_medium" class="text-[11px] text-muted mt-1">
                {{ [item.utm_source, item.utm_medium].filter(Boolean).join(' / ') }}
              </p>
              <span v-if="!item.campaign && !item.utm_source && !item.utm_medium" class="text-muted">—</span>
            </td>
            <td class="px-4 py-3">{{ item.job_vacancies_count ?? 0 }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDateTime(item.created_at) }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Ver perfil / editar', onClick: () => navigateTo(`/admin/empresas/${item.id}`) },
                { label: 'Ver vagas', onClick: () => navigateTo(`/admin/vagas-emprego?company_id=${item.id}`) },
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
import type { Company } from '~/types/company-job-vacancy'
import { formatCnpj } from '~/utils/cnpj'
import { formatDateTime } from '~/utils/datetime'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'companies' })

const rows = ref<Company[]>([])
const campaigns = ref<string[]>([])
const loadError = ref('')
const q = ref('')
const campaign = ref('')
const page = ref(1)
const lastPage = ref(1)

async function load(p = 1) {
  try {
    const params = new URLSearchParams({ page: String(p), per_page: '20' })
    if (q.value.trim()) params.set('q', q.value.trim())
    if (campaign.value) params.set('campaign', campaign.value)
    const data = await useApi<any>(`/admin/companies?${params}`)
    rows.value = data.data || data
    campaigns.value = data.campaigns || []
    page.value = data.current_page || p
    lastPage.value = data.last_page || 1
    loadError.value = ''
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar empresas.'
  }
}

onMounted(() => load(1))
</script>
