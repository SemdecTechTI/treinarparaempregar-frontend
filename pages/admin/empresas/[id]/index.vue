<template>
  <div>
    <AdminHeader :title="company?.legal_name || 'Empresa'">
      <AdminActionButton to="/admin/empresas" label="Voltar" variant="outline" size="md" />
    </AdminHeader>

    <p v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</p>

    <div v-if="company" class="space-y-6">
      <AdminFormPanel title="Perfil da empresa">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">CNPJ</label>
            <input :value="formatCnpj(form.cnpj)" class="input-modern bg-gray-50" readonly />
          </div>
          <div>
            <label class="form-label">Razão social</label>
            <input v-model="form.legal_name" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Nome fantasia</label>
            <input v-model="form.trade_name" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Porte</label>
            <input v-model="form.company_size" class="input-modern" />
          </div>
          <div class="md:col-span-2">
            <label class="form-label">Ramo / CNAE</label>
            <input v-model="form.business_activity" class="input-modern" />
          </div>
          <div>
            <label class="form-label">CEP</label>
            <input v-model="form.zip_code" v-maska data-maska="#####-###" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Endereço</label>
            <input v-model="form.address" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Município</label>
            <input v-model="form.city" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Bairro</label>
            <input v-model="form.neighborhood" class="input-modern" />
          </div>
          <div class="md:col-span-2">
            <label class="form-label">Ponto de referência</label>
            <input v-model="form.reference_point" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Telefone</label>
            <input v-model="form.phone_primary" v-maska data-maska="(##) #####-####" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Telefone 2</label>
            <input v-model="form.phone_secondary" v-maska data-maska="(##) #####-####" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Responsável</label>
            <input v-model="form.contact_name" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Cargo</label>
            <input v-model="form.contact_role" class="input-modern" />
          </div>
          <div>
            <label class="form-label">E-mail</label>
            <input v-model="form.email" type="email" class="input-modern" />
          </div>
          <div>
            <label class="form-label">Site</label>
            <input v-model="form.website" class="input-modern" />
          </div>
        </div>
        <p v-if="saveError" class="text-sm text-red-600 mt-3">{{ saveError }}</p>
        <div class="mt-4">
          <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar cadastro'" variant="primary" size="md" :disabled="saving" @click="save" />
        </div>
      </AdminFormPanel>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <h2 class="font-semibold text-primary">Vagas desta empresa</h2>
          <AdminActionButton
            :to="`/admin/vagas-emprego?company_id=${company.id}`"
            label="Abrir listagem filtrada"
            variant="outline"
            size="sm"
          />
        </div>
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">Função</th>
              <th class="px-4 py-3 text-left">Qtd</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!company.job_vacancies?.length" class="border-t">
              <td colspan="4" class="px-4 py-6 text-center text-muted">Nenhuma vaga.</td>
            </tr>
            <tr v-for="vacancy in company.job_vacancies" :key="vacancy.id" class="border-t">
              <td class="px-4 py-3 font-medium">{{ vacancy.job_title }}</td>
              <td class="px-4 py-3">{{ vacancy.openings_count }}</td>
              <td class="px-4 py-3"><JobVacancyStatusBadge :status="vacancy.status" /></td>
              <td class="px-4 py-3 text-right">
                <AdminActionButton :to="`/admin/vagas-emprego/${vacancy.id}`" label="Abrir" variant="outline" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Company } from '~/types/company-job-vacancy'
import { formatCnpj } from '~/utils/cnpj'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'companies' })

const route = useRoute()
const id = computed(() => Number(route.params.id))
const company = ref<Company | null>(null)
const loadError = ref('')
const saveError = ref('')
const saving = ref(false)
const dialog = useDialog()

const form = reactive({
  cnpj: '',
  legal_name: '',
  trade_name: '',
  company_size: '',
  business_activity: '',
  address: '',
  zip_code: '',
  city: '',
  neighborhood: '',
  reference_point: '',
  phone_primary: '',
  phone_secondary: '',
  contact_name: '',
  contact_role: '',
  email: '',
  website: '',
})

async function load() {
  try {
    company.value = await useApi<Company>(`/admin/companies/${id.value}`)
    Object.assign(form, {
      cnpj: company.value.cnpj,
      legal_name: company.value.legal_name,
      trade_name: company.value.trade_name,
      company_size: company.value.company_size,
      business_activity: company.value.business_activity,
      address: company.value.address,
      zip_code: company.value.zip_code,
      city: company.value.city,
      neighborhood: company.value.neighborhood || '',
      reference_point: company.value.reference_point,
      phone_primary: company.value.phone_primary,
      phone_secondary: company.value.phone_secondary || '',
      contact_name: company.value.contact_name,
      contact_role: company.value.contact_role,
      email: company.value.email,
      website: company.value.website || '',
    })
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar empresa.'
  }
}

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    company.value = await useApi<Company>(`/admin/companies/${id.value}`, {
      method: 'PUT',
      body: { ...form },
    })
    await dialog.toastSuccess('Cadastro atualizado.')
    await load()
  } catch (e: any) {
    saveError.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
