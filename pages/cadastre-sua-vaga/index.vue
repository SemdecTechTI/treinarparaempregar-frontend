<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent text-white py-12 lg:py-16">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>
      <div class="container mx-auto px-4 relative z-10 max-w-4xl">
        <p class="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">Empresas</p>
        <h1 class="text-white text-3xl lg:text-4xl font-semibold mb-3">Cadastre sua vaga</h1>
        <p class="text-white/85 max-w-2xl text-base lg:text-lg">
          Canal exclusivo para empresas solicitarem vagas ao SIMM. As informações ficam em análise interna
          da equipe e, após aprovação, serão divulgadas.
        </p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-10 lg:py-14 max-w-4xl space-y-6">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(label, i) in stepLabels"
          :key="label"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors"
          :class="i <= stepIndex ? 'bg-primary text-white border-primary' : 'bg-white text-muted border-gray-200'"
        >
          <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{{ i + 1 }}</span>
          {{ label }}
        </span>
      </div>

      <FormSection
        v-if="step === 'cnpj'"
        title="Identificação da empresa"
        description="Informe o CNPJ para iniciar. Se a empresa já estiver cadastrada, você poderá ver as vagas anteriores."
        emoji="🏢"
      >
        <div class="max-w-md">
          <label class="form-label">CNPJ *</label>
          <input
            v-model="cnpjInput"
            v-maska
            data-maska="##.###.###/####-##"
            type="text"
            class="input-modern"
            placeholder="00.000.000/0000-00"
            @keyup.enter="lookupCnpj"
          />
          <p v-if="cnpjError" class="text-xs text-red-500 mt-1">{{ cnpjError }}</p>
          <p v-if="cnpjLoading" class="text-xs text-muted mt-1">Consultando CNPJ...</p>
        </div>

        <div v-if="lookupDone" class="mt-6 space-y-4">
          <div v-if="existingCompany" class="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <p class="text-sm text-text">
              Encontramos o cadastro de <strong>{{ existingCompany.legal_name }}</strong>
              ({{ existingCompany.job_vacancies_count || 0 }} vaga(s) já enviada(s)).
              O cadastro da empresa é único por CNPJ — você pode ir direto para a vaga.
            </p>
            <div class="flex flex-wrap gap-3 mt-4">
              <button type="button" class="btn text-sm py-2" @click="goVacancyStepFromExisting()">
                Cadastrar nova vaga
              </button>
              <button type="button" class="btn btn-outline text-sm py-2" @click="goCompanyStep(true)">
                Atualizar dados da empresa
              </button>
              <button type="button" class="btn btn-outline text-sm py-2" @click="showMyVacancies = true; loadMyVacancies()">
                Ver vagas cadastradas
              </button>
            </div>
          </div>
          <div v-else class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p class="text-sm text-muted">
              {{ registry?.legal_name
                ? 'Encontramos dados na Receita. Confira e complete o cadastro da empresa.'
                : 'Não encontramos cadastro prévio. Preencha os dados da empresa para continuar.' }}
            </p>
            <button type="button" class="btn text-sm py-2 mt-4" @click="goCompanyStep(false)">
              Continuar cadastro da empresa
            </button>
          </div>
        </div>

        <button
          v-if="!lookupDone"
          type="button"
          class="btn mt-6"
          :disabled="cnpjLoading"
          @click="lookupCnpj"
        >
          Consultar CNPJ
        </button>
      </FormSection>

      <div v-if="showMyVacancies" class="card-modern p-6 lg:p-8">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="text-lg font-semibold text-primary">Vagas já cadastradas</h2>
          <button type="button" class="text-sm text-muted hover:text-primary" @click="showMyVacancies = false">Fechar</button>
        </div>
        <p v-if="vacanciesLoading" class="text-sm text-muted">Carregando...</p>
        <p v-else-if="!myVacancies.length" class="text-sm text-muted">Nenhuma vaga cadastrada ainda.</p>
        <div v-else class="space-y-3">
          <div
            v-for="vacancy in myVacancies"
            :key="vacancy.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 rounded-xl p-4"
          >
            <div>
              <p class="font-medium text-primary">{{ vacancy.job_title }}</p>
              <p class="text-xs text-muted mt-1">
                {{ vacancy.openings_count }} vaga(s) · {{ formatDate(vacancy.created_at) }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <JobVacancyStatusBadge :status="vacancy.status" />
              <button type="button" class="btn btn-outline text-sm py-2" @click="duplicateToForm(vacancy)">
                Duplicar para nova
              </button>
            </div>
          </div>
        </div>
      </div>

      <form v-if="step === 'company'" class="space-y-6" @submit.prevent="saveCompany">
        <FormSection title="Cadastro da empresa" description="Dados cadastrais da empresa solicitante." emoji="📋">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="form-label">CNPJ *</label>
              <input :value="formatCnpj(companyForm.cnpj)" type="text" class="input-modern bg-gray-50" readonly />
            </div>
            <div>
              <label class="form-label">Razão social *</label>
              <input v-model="companyForm.legal_name" type="text" required class="input-modern" />
              <p v-if="registryHint" class="text-xs text-muted mt-1">{{ registryHint }}</p>
            </div>
            <div>
              <label class="form-label">Nome fantasia *</label>
              <input v-model="companyForm.trade_name" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Porte da empresa *</label>
              <select v-model="companyForm.company_size" required class="input-modern">
                <option value="">Selecione...</option>
                <option v-for="size in COMPANY_SIZES" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Ramo de atividade / CNAE *</label>
              <input v-model="companyForm.business_activity" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">CEP *</label>
              <input
                v-model="companyForm.zip_code"
                v-maska
                data-maska="#####-###"
                required
                class="input-modern"
                @blur="onCepBlur"
              />
              <p v-if="cepLoading" class="text-xs text-muted mt-1">Buscando endereço...</p>
            </div>
            <div>
              <label class="form-label">Endereço *</label>
              <input v-model="companyForm.address" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Município *</label>
              <input v-model="companyForm.city" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Bairro</label>
              <input v-model="companyForm.neighborhood" type="text" class="input-modern" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Ponto de referência *</label>
              <input v-model="companyForm.reference_point" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Telefone *</label>
              <input v-model="companyForm.phone_primary" v-maska data-maska="(##) #####-####" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Telefone 2</label>
              <input v-model="companyForm.phone_secondary" v-maska data-maska="(##) #####-####" class="input-modern" />
            </div>
            <div>
              <label class="form-label">Responsável *</label>
              <input v-model="companyForm.contact_name" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Cargo *</label>
              <input v-model="companyForm.contact_role" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">E-mail *</label>
              <input v-model="companyForm.email" type="email" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Site</label>
              <input v-model="companyForm.website" type="url" class="input-modern" placeholder="https://" />
            </div>
          </div>

          <div class="mt-6">
            <label class="form-label">Período que mais contrata *</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <label
                v-for="period in HIRING_PERIODS"
                :key="period"
                class="inline-flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <input
                  v-model="companyForm.hiring_periods"
                  type="checkbox"
                  :value="period"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                  @change="onHiringPeriodChange(period)"
                />
                {{ period }}
              </label>
            </div>
          </div>
        </FormSection>

        <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{{ error }}</p>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="btn btn-outline" @click="step = 'cnpj'">Voltar</button>
          <button type="submit" class="btn" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Salvar empresa e continuar' }}
          </button>
        </div>
      </form>

      <form v-if="step === 'vacancy'" class="space-y-6" @submit.prevent="saveVacancy">
        <FormSection title="Cadastro da vaga" description="Detalhes da solicitação de vaga." emoji="💼">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="form-label">Função *</label>
              <input v-model="vacancyForm.job_title" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Quantidade de vagas *</label>
              <input v-model.number="vacancyForm.openings_count" type="number" min="1" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Tipo da vaga *</label>
              <input v-model="vacancyForm.vacancy_type" type="text" required class="input-modern" placeholder="CLT, Temporário, Estágio..." />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Atividades da função *</label>
              <textarea v-model="vacancyForm.activities" rows="3" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Salário</label>
              <input
                v-model="vacancyForm.salary"
                v-maska:[salaryMaskOptions]
                data-maska="9.99#,##"
                data-maska-tokens="9:[0-9]:repeated"
                type="text"
                class="input-modern"
                placeholder="Deixe em branco se for a combinar"
              />
              <p class="text-xs text-muted mt-1">Se não informar, será registrado como “A combinar”.</p>
            </div>
            <div>
              <label class="form-label">Habilitação</label>
              <select v-model="vacancyForm.driver_license" class="input-modern">
                <option v-for="license in DRIVER_LICENSES" :key="license" :value="license">{{ license }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Disponibilidade de veículo?</label>
              <select v-model="vacancyForm.vehicle_required" class="input-modern">
                <option :value="null">Não informado</option>
                <option :value="true">Sim</option>
                <option :value="false">Não</option>
              </select>
            </div>
            <div>
              <label class="form-label">Escolaridade *</label>
              <select v-model="vacancyForm.education_level" required class="input-modern">
                <option value="">Selecione...</option>
                <option v-for="level in EDUCATION_LEVELS" :key="level" :value="level">{{ level }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Curso *</label>
              <input v-model="vacancyForm.course_requirement" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Tempo de experiência</label>
              <input v-model="vacancyForm.experience_time" type="text" class="input-modern" placeholder="Ex.: 6 meses" />
              <p class="text-xs text-muted mt-1">Se deixar em branco, a vaga não exige experiência. Por orientação legal, não exigir mais de 6 meses.</p>
            </div>
            <div>
              <label class="form-label">Horário de trabalho *</label>
              <input v-model="vacancyForm.work_schedule" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Dias da semana *</label>
              <input v-model="vacancyForm.work_days" type="text" required class="input-modern" placeholder="Segunda a Sexta" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Perfil comportamental</label>
              <textarea v-model="vacancyForm.behavioral_profile" rows="2" class="input-modern" />
            </div>
          </div>
        </FormSection>

        <FormSection title="Benefícios" description="Marque os benefícios oferecidos." emoji="🎁" icon-bg="bg-gradient-to-br from-accent to-h3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              v-for="benefit in BENEFIT_OPTIONS"
              :key="benefit"
              class="inline-flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              <input v-model="vacancyForm.benefits" type="checkbox" :value="benefit" class="rounded border-gray-300 text-primary focus:ring-primary" />
              {{ benefit }}
            </label>
          </div>
          <div class="mt-4">
            <label class="form-label">Outros benefícios</label>
            <input v-model="vacancyForm.other_benefits" type="text" class="input-modern" />
          </div>
          <div class="mt-4">
            <label class="form-label">Tipo de comprovação de experiência</label>
            <div class="flex flex-wrap gap-3 mt-2">
              <label
                v-for="proof in PROOF_OPTIONS"
                :key="proof"
                class="inline-flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 cursor-pointer"
              >
                <input v-model="vacancyForm.proof_types" type="checkbox" :value="proof" class="rounded border-gray-300 text-primary focus:ring-primary" />
                {{ proof }}
              </label>
            </div>
          </div>
          <div class="mt-4">
            <label class="form-label">Habilidades e conhecimentos</label>
            <textarea v-model="vacancyForm.skills" rows="2" class="input-modern" />
          </div>
        </FormSection>

        <FormSection title="Inclusão (PCD) e seleção" description="Informações obrigatórias para a triagem." emoji="♿" icon-bg="bg-gradient-to-br from-h5 to-h6">
          <div class="space-y-5">
            <div>
              <label class="form-label">Aceita pessoas com deficiência? *</label>
              <select v-model="vacancyForm.accepts_pwd" required class="input-modern max-w-xs">
                <option :value="true">Sim</option>
                <option :value="false">Não</option>
              </select>
            </div>
            <div v-if="vacancyForm.accepts_pwd">
              <label class="form-label">Tipo de deficiência</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <label
                  v-for="item in DISABILITY_OPTIONS"
                  :key="item"
                  class="inline-flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 cursor-pointer"
                >
                  <input v-model="vacancyForm.disability_types" type="checkbox" :value="item" class="rounded border-gray-300 text-primary focus:ring-primary" />
                  {{ item }}
                </label>
              </div>
            </div>
            <div v-else>
              <label class="form-label">Justificativa caso não aceite *</label>
              <textarea v-model="vacancyForm.pwd_justification" rows="2" :required="!vacancyForm.accepts_pwd" class="input-modern" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="form-label">Data da seleção *</label>
                <input v-model="vacancyForm.selection_date" type="date" required class="input-modern" />
              </div>
              <div>
                <label class="form-label">Horário da seleção *</label>
                <input v-model="vacancyForm.selection_time" type="text" required class="input-modern" placeholder="09:00" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label">Endereço da seleção *</label>
                <input v-model="vacancyForm.selection_address" type="text" required class="input-modern" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label">Responsável pela seleção *</label>
                <input v-model="vacancyForm.selection_contact" type="text" required class="input-modern" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label">Observações gerais</label>
                <textarea v-model="vacancyForm.notes" rows="3" class="input-modern" />
              </div>
            </div>
          </div>
        </FormSection>

        <p class="text-xs text-muted">
          As vagas não são publicadas automaticamente para cidadãos. Elas passam por análise antes da divulgação em outros canais pela equipe do SIMM.
        </p>

        <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{{ error }}</p>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="btn btn-outline" @click="step = 'company'">Voltar</button>
          <button type="submit" class="btn" :disabled="saving">
            {{ saving ? 'Enviando...' : 'Enviar solicitação de vaga' }}
          </button>
        </div>
      </form>

      <div v-if="step === 'success'" class="card-modern p-8 text-center space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl">✓</div>
        <h2 class="text-xl font-semibold text-primary">Solicitação enviada</h2>
        <p class="text-muted max-w-lg mx-auto">
          Sua vaga foi registrada com status <strong>Pendente</strong> e será analisada pela equipe.
          Guarde o CNPJ para consultar ou duplicar vagas no futuro.
        </p>
        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <button type="button" class="btn btn-outline" @click="showMyVacancies = true; loadMyVacancies(); step = 'cnpj'">
            Ver minhas vagas
          </button>
          <button type="button" class="btn" @click="resetWizard(true)">Cadastrar outra vaga</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BENEFIT_OPTIONS,
  COMPANY_SIZES,
  DISABILITY_OPTIONS,
  DRIVER_LICENSES,
  EDUCATION_LEVELS,
  HIRING_PERIODS,
  PROOF_OPTIONS,
  type Company,
  type JobVacancy,
} from '~/types/company-job-vacancy'
import { formatCnpj, isValidCnpj, normalizeCnpj } from '~/utils/cnpj'

usePageSeo({
  title: 'Cadastre sua vaga',
  description: 'Empresas podem solicitar vagas ao SIMM. Cadastro com CNPJ, dados da empresa e detalhes da vaga.',
})

const { loading: cepLoading, fetchCep } = useCep()

type Step = 'cnpj' | 'company' | 'vacancy' | 'success'
const step = ref<Step>('cnpj')
const stepLabels = ['CNPJ', 'Empresa', 'Vaga']
const stepIndex = computed(() => {
  if (step.value === 'company') return 1
  if (step.value === 'vacancy' || step.value === 'success') return 2
  return 0
})

watch(step, () => {
  if (!import.meta.client) return
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
})

const cnpjInput = ref('')
const cnpjLoading = ref(false)
const cnpjError = ref('')
const lookupDone = ref(false)
const existingCompany = ref<Company | null>(null)
const registry = ref<Record<string, string | null> | null>(null)
const registryHint = ref('')
const showMyVacancies = ref(false)
const myVacancies = ref<JobVacancy[]>([])
const vacanciesLoading = ref(false)
const saving = ref(false)
const error = ref('')

const companyForm = reactive({
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
  hiring_periods: [] as string[],
})

function emptyVacancyForm() {
  return {
    job_title: '',
    openings_count: 1,
    vacancy_type: '',
    activities: '',
    salary: '',
    driver_license: 'Não exige',
    vehicle_required: null as boolean | null,
    education_level: '',
    course_requirement: '',
    experience_time: '',
    work_schedule: '',
    work_days: '',
    behavioral_profile: '',
    benefits: [] as string[],
    other_benefits: '',
    proof_types: [] as string[],
    skills: '',
    accepts_pwd: true,
    disability_types: [] as string[],
    pwd_justification: '',
    selection_date: '',
    selection_time: '',
    selection_address: '',
    selection_contact: '',
    notes: '',
    duplicated_from_id: null as number | null,
  }
}

const vacancyForm = reactive(emptyVacancyForm())

const salaryMaskOptions = {
  reversed: true,
  preProcess: (val: string) => val.replace(/^R\$\s?/, ''),
  postProcess: (val: string) => (val ? `R$ ${val}` : ''),
}

async function lookupCnpj() {
  cnpjError.value = ''
  error.value = ''
  lookupDone.value = false
  existingCompany.value = null
  registry.value = null
  registryHint.value = ''
  showMyVacancies.value = false

  const digits = normalizeCnpj(cnpjInput.value)
  if (!isValidCnpj(digits)) {
    cnpjError.value = 'Informe um CNPJ válido.'
    return
  }

  cnpjLoading.value = true
  try {
    const data = await useApiPublic<{
      cnpj_digits: string
      company: Company | null
      registry: Record<string, string | null> | null
      found_in_db: boolean
    }>(`/companies/cnpj/${digits}`)

    companyForm.cnpj = data.cnpj_digits
    existingCompany.value = data.company
    registry.value = data.registry
    lookupDone.value = true

    if (data.company) {
      fillCompany(data.company)
    } else if (data.registry) {
      applyRegistry(data.registry)
      registryHint.value = 'Razão social preenchida automaticamente pela consulta à Receita (BrasilAPI). Você pode editar se necessário.'
    }
  } catch (e: any) {
    cnpjError.value = e?.data?.message || e?.data?.errors?.cnpj?.[0] || 'Não foi possível consultar o CNPJ.'
  } finally {
    cnpjLoading.value = false
  }
}

function fillCompany(company: Company) {
  companyForm.cnpj = company.cnpj
  companyForm.legal_name = company.legal_name
  companyForm.trade_name = company.trade_name
  companyForm.company_size = company.company_size
  companyForm.business_activity = company.business_activity
  companyForm.address = company.address
  companyForm.zip_code = company.zip_code
  companyForm.city = company.city
  companyForm.neighborhood = company.neighborhood || ''
  companyForm.reference_point = company.reference_point
  companyForm.phone_primary = company.phone_primary
  companyForm.phone_secondary = company.phone_secondary || ''
  companyForm.contact_name = company.contact_name
  companyForm.contact_role = company.contact_role
  companyForm.email = company.email
  companyForm.website = company.website || ''
  companyForm.hiring_periods = [...(company.hiring_periods || [])]
}

function applyRegistry(data: Record<string, string | null>) {
  if (data.legal_name) companyForm.legal_name = data.legal_name
  if (data.trade_name) companyForm.trade_name = data.trade_name
  if (data.company_size) companyForm.company_size = data.company_size
  if (data.business_activity) companyForm.business_activity = data.business_activity
  if (data.address) companyForm.address = data.address
  if (data.zip_code) companyForm.zip_code = data.zip_code
  if (data.city) companyForm.city = data.city
  if (data.neighborhood) companyForm.neighborhood = data.neighborhood
  if (data.email) companyForm.email = data.email
  if (data.phone_primary) companyForm.phone_primary = data.phone_primary
}

function goCompanyStep(fromExisting: boolean) {
  if (!fromExisting && registry.value) applyRegistry(registry.value)
  if (fromExisting && existingCompany.value) fillCompany(existingCompany.value)
  step.value = 'company'
  showMyVacancies.value = false
}

// Empresa já cadastrada: pula a etapa de empresa e vai direto para a vaga
function goVacancyStepFromExisting() {
  if (existingCompany.value) fillCompany(existingCompany.value)
  step.value = 'vacancy'
  showMyVacancies.value = false
}

function onHiringPeriodChange(period: string) {
  if (period === 'Nenhum' && companyForm.hiring_periods.includes('Nenhum')) {
    companyForm.hiring_periods = ['Nenhum']
  } else if (period !== 'Nenhum') {
    companyForm.hiring_periods = companyForm.hiring_periods.filter((item) => item !== 'Nenhum')
  }
}

async function onCepBlur() {
  const result = await fetchCep(companyForm.zip_code)
  if (result) {
    if (result.logradouro) companyForm.address = result.logradouro
    if (result.bairro) companyForm.neighborhood = result.bairro
    if (result.localidade) companyForm.city = result.localidade
  }
}

async function saveCompany() {
  if (!companyForm.hiring_periods.length) {
    error.value = 'Selecione ao menos um período de contratação (ou Nenhum).'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await ensureSanctumCsrf()
    const saved = await useApiPublic<Company>('/companies', {
      method: 'POST',
      body: { ...companyForm },
      credentials: 'include',
    })
    existingCompany.value = saved
    step.value = 'vacancy'
  } catch (e: any) {
    error.value = e?.data?.message || firstValidationError(e) || 'Erro ao salvar empresa.'
  } finally {
    saving.value = false
  }
}

async function saveVacancy() {
  if (!vacancyForm.accepts_pwd && !vacancyForm.pwd_justification.trim()) {
    error.value = 'Informe a justificativa quando a vaga não aceita PCD.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await ensureSanctumCsrf()
    await useApiPublic(`/companies/${companyForm.cnpj}/vacancies`, {
      method: 'POST',
      body: {
        ...vacancyForm,
        salary: vacancyForm.salary.trim() || 'A combinar',
        experience_time: vacancyForm.experience_time.trim() || 'Não exige',
      },
      credentials: 'include',
    })
    step.value = 'success'
    Object.assign(vacancyForm, emptyVacancyForm())
  } catch (e: any) {
    error.value = e?.data?.message || firstValidationError(e) || 'Erro ao enviar vaga.'
  } finally {
    saving.value = false
  }
}

async function loadMyVacancies() {
  const cnpj = companyForm.cnpj || normalizeCnpj(cnpjInput.value)
  if (!cnpj) return
  vacanciesLoading.value = true
  try {
    const data = await useApiPublic<{ vacancies: JobVacancy[] }>(`/companies/${cnpj}/vacancies`)
    myVacancies.value = data.vacancies
  } catch {
    myVacancies.value = []
  } finally {
    vacanciesLoading.value = false
  }
}

function duplicateToForm(vacancy: JobVacancy) {
  Object.assign(vacancyForm, {
    job_title: vacancy.job_title,
    openings_count: vacancy.openings_count,
    vacancy_type: vacancy.vacancy_type,
    activities: vacancy.activities,
    salary: vacancy.salary,
    driver_license: vacancy.driver_license || 'Não exige',
    vehicle_required: vacancy.vehicle_required ?? null,
    education_level: vacancy.education_level,
    course_requirement: vacancy.course_requirement,
    experience_time: vacancy.experience_time,
    work_schedule: vacancy.work_schedule,
    work_days: vacancy.work_days,
    behavioral_profile: vacancy.behavioral_profile || '',
    benefits: [...(vacancy.benefits || [])],
    other_benefits: vacancy.other_benefits || '',
    proof_types: [...(vacancy.proof_types || [])],
    skills: vacancy.skills || '',
    accepts_pwd: vacancy.accepts_pwd,
    disability_types: [...(vacancy.disability_types || [])],
    pwd_justification: vacancy.pwd_justification || '',
    selection_date: vacancy.selection_date?.slice?.(0, 10) || vacancy.selection_date,
    selection_time: vacancy.selection_time,
    selection_address: vacancy.selection_address,
    selection_contact: vacancy.selection_contact,
    notes: vacancy.notes || '',
    duplicated_from_id: vacancy.id,
  })
  showMyVacancies.value = false
  if (existingCompany.value) fillCompany(existingCompany.value)
  step.value = 'vacancy'
}

function resetWizard(keepCnpj = false) {
  const cnpj = keepCnpj ? (companyForm.cnpj || cnpjInput.value) : ''
  step.value = keepCnpj ? 'company' : 'cnpj'
  lookupDone.value = keepCnpj
  showMyVacancies.value = false
  error.value = ''
  Object.assign(vacancyForm, emptyVacancyForm())
  if (!keepCnpj) {
    cnpjInput.value = ''
    existingCompany.value = null
    registry.value = null
  } else {
    cnpjInput.value = formatCnpj(cnpj)
  }
}

function firstValidationError(e: any): string | undefined {
  const errors = Object.values(e?.data?.errors || {}) as string[][]
  return errors[0]?.[0]
}

function formatDate(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}
</script>
