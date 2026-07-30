<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent text-white py-12 lg:py-16">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>
      <div class="container mx-auto px-4 relative z-10 max-w-4xl">
        <p class="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">Cadastro gratuito</p>
        <h1 class="text-white text-3xl lg:text-4xl font-semibold mb-3">Crie sua conta</h1>
        <p class="text-white/85 max-w-xl text-base lg:text-lg">
          Preencha o formulário abaixo e tenha acesso a cursos presenciais, online e EAD da Prefeitura de Salvador.
        </p>
        <p class="text-sm mt-6 text-white/80">
          Já possui cadastro?
          <NuxtLink to="/entrar" class="text-white font-bold underline underline-offset-4 hover:text-white/90">
            Faça login
          </NuxtLink>
        </p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-10 lg:py-14 max-w-4xl">
      <div class="flex flex-wrap gap-2 mb-8">
        <span
          v-for="(step, i) in steps"
          :key="step"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors"
          :class="i <= currentStep ? 'bg-primary text-white border-primary' : 'bg-white text-muted border-gray-200'"
        >
          <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{{ i + 1 }}</span>
          {{ step }}
        </span>
      </div>

      <form @submit.prevent="submit" class="space-y-6">
        <FormSection
          title="Dados pessoais"
          description="Informações básicas e documentos de identificação."
          emoji="👤"
          icon-bg="bg-gradient-to-br from-primary to-primary-light"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="form-label">Nome completo *</label>
              <input v-model="form.name" type="text" required class="input-modern" placeholder="Como consta no documento" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Nome social</label>
              <input v-model="form.social_name" type="text" class="input-modern" placeholder="Caso pertença ao público LGBT (opcional)" />
            </div>
            <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="form-label">Sexo *</label>
                <select v-model="form.gender" required class="input-modern">
                  <option value="">Selecione...</option>
                  <option v-for="opt in SEXOS" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Orientação sexual *</label>
                <select v-model="form.sexual_orientation" required class="input-modern">
                  <option value="">Selecione...</option>
                  <option v-for="opt in ORIENTACOES_SEXUAIS" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Identidade de gênero *</label>
                <select v-model="form.gender_identity" required class="input-modern">
                  <option value="">Selecione...</option>
                  <option v-for="opt in IDENTIDADES_GENERO" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="form-label">Raça / cor *</label>
              <select v-model="form.race" required class="input-modern">
                <option value="">Selecione...</option>
                <option v-for="opt in RACAS" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Data de nascimento *</label>
              <input v-model="form.birth_date" type="date" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Naturalidade *</label>
              <input v-model="form.birthplace" type="text" required class="input-modern" placeholder="Cidade / UF de nascimento" />
            </div>
            <div>
              <label class="form-label">CPF *</label>
              <input v-model="form.cpf" v-maska data-maska="###.###.###-##" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">RG *</label>
              <input v-model="form.rg" type="text" required class="input-modern" maxlength="30" />
            </div>
            <div>
              <label class="form-label">Data de emissão do RG *</label>
              <input v-model="form.rg_issue_date" type="date" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Órgão emissor do RG *</label>
              <input v-model="form.rg_issuer" type="text" required class="input-modern" placeholder="Ex.: SSP/BA" />
            </div>
            <div>
              <label class="form-label">Escolaridade *</label>
              <select v-model="form.education" required class="input-modern">
                <option value="">Selecione...</option>
                <option v-for="opt in ESCOLARIDADES" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Nome da mãe *</label>
              <input v-model="form.mother_name" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Nome do pai</label>
              <input v-model="form.father_name" type="text" class="input-modern" />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Deficiência e benefícios"
          description="Informações sociais usadas pelos programas do município."
          emoji="♿"
          icon-bg="bg-gradient-to-br from-h5 to-accent"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="form-label">Portador de deficiência *</label>
              <select v-model="form.has_disability" required class="input-modern">
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
            <div v-if="form.has_disability === 'sim'" class="md:col-span-2">
              <label class="form-label">Se portador de deficiência, qual *</label>
              <div class="grid sm:grid-cols-2 gap-2 mt-1">
                <label
                  v-for="opt in DEFICIENCIAS"
                  :key="opt"
                  class="flex items-center gap-2 text-sm border rounded px-3 py-2 cursor-pointer"
                  :class="form.disability_types.includes(opt) ? 'border-primary bg-primary/5' : 'border-gray-200'"
                >
                  <input v-model="form.disability_types" type="checkbox" :value="opt" class="accent-[#1a2d4a]" />
                  {{ opt }}
                </label>
              </div>
            </div>
            <div>
              <label class="form-label">Está cadastrado no CadÚnico *</label>
              <select v-model="form.registered_cadunico" required class="input-modern">
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
            <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="form-label">Recebe algum benefício social *</label>
                <select v-model="form.receives_social_benefit" required class="input-modern">
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
              <div v-if="form.receives_social_benefit === 'sim'">
                <label class="form-label">Nome do benefício *</label>
                <input v-model="form.social_benefit_name" type="text" required class="input-modern" placeholder="Ex.: Bolsa Família" />
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Contato e acesso"
          description="E-mail, telefone e senha para entrar na plataforma."
          emoji="🔐"
          icon-bg="bg-gradient-to-br from-accent to-h3"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="form-label">E-mail *</label>
              <input v-model="form.email" type="email" required class="input-modern" placeholder="seu@email.com" />
            </div>
            <div>
              <label class="form-label">Telefone *</label>
              <input v-model="form.phone" v-maska data-maska="(##) #####-####" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Senha *</label>
              <input v-model="form.password" type="password" required minlength="8" class="input-modern" placeholder="Mínimo 8 caracteres" />
            </div>
            <div>
              <label class="form-label">Confirmar senha *</label>
              <input v-model="form.password_confirmation" type="password" required class="input-modern" placeholder="Repita a senha" />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Endereço"
          description="Usado para comunicação e organização das turmas presenciais."
          emoji="📍"
          icon-bg="bg-gradient-to-br from-h5 to-h6"
        >
          <div class="grid grid-cols-1 md:grid-cols-6 gap-5">
            <div class="md:col-span-2">
              <label class="form-label">CEP *</label>
              <input
                v-model="form.cep"
                v-maska
                data-maska="#####-###"
                required
                class="input-modern"
                @blur="onCepBlur"
              />
              <p v-if="cepLoading" class="text-xs text-muted mt-1">Buscando endereço...</p>
              <p v-if="cepError" class="text-xs text-red-500 mt-1">{{ cepError }}</p>
            </div>
            <div class="md:col-span-4">
              <label class="form-label">Endereço *</label>
              <input v-model="form.address" type="text" required class="input-modern" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Número da residência *</label>
              <input v-model="form.number" type="text" required class="input-modern" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Bairro *</label>
              <input v-model="form.neighborhood" type="text" required class="input-modern" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Complemento</label>
              <input v-model="form.complement" type="text" class="input-modern" placeholder="Apto, bloco..." />
            </div>
            <div class="md:col-span-3">
              <label class="form-label">Cidade *</label>
              <input v-model="form.city" type="text" required class="input-modern" />
            </div>
            <div class="md:col-span-3">
              <label class="form-label">Estado *</label>
              <select v-model="form.state" required class="input-modern">
                <option value="">UF</option>
                <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
              </select>
            </div>
          </div>
        </FormSection>

        <div class="card-modern p-6 lg:p-8">
          <label class="flex items-start gap-3 text-sm cursor-pointer">
            <input v-model="acceptedTerms" type="checkbox" required class="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span class="text-text">
              Li e aceito os
              <button type="button" class="text-accent font-semibold hover:underline" @click="showTermos = true">termos de uso</button>
              da plataforma Treinar para Empregar.
            </span>
          </label>

          <p v-if="error" class="mt-4 text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{{ error }}</p>

          <button type="submit" class="btn w-full py-4 rounded-xl text-base mt-6" :disabled="loading">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Cadastrando...
            </span>
            <span v-else>Criar minha conta gratuitamente</span>
          </button>
        </div>
      </form>
    </div>

    <ModalTermos v-model:open="showTermos" />
  </div>
</template>

<script setup lang="ts">
import {
  DEFICIENCIAS,
  ESCOLARIDADES,
  IDENTIDADES_GENERO,
  ORIENTACOES_SEXUAIS,
  RACAS,
  SEXOS,
} from '~/utils/citizenProfile'

definePageMeta({ middleware: 'guest' })

const route = useRoute()
const auth = useAuthStore()
const { loading: cepLoading, error: cepError, fetchCep } = useCep()

const steps = ['Dados pessoais', 'Benefícios', 'Contato', 'Endereço']
const currentStep = 3

const ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

const form = reactive({
  name: '',
  social_name: '',
  email: '',
  cpf: '',
  rg: '',
  rg_issue_date: '',
  rg_issuer: '',
  birth_date: '',
  birthplace: '',
  mother_name: '',
  father_name: '',
  password: '',
  password_confirmation: '',
  gender: '',
  sexual_orientation: '',
  gender_identity: '',
  race: '',
  education: '',
  has_disability: 'nao',
  disability_types: [] as string[],
  phone: '',
  cep: '',
  address: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  complement: '',
  registered_cadunico: 'nao',
  receives_social_benefit: 'nao',
  social_benefit_name: '',
})

const loading = ref(false)
const error = ref('')
const acceptedTerms = ref(false)
const showTermos = ref(false)

watch(() => form.has_disability, (value) => {
  if (value !== 'sim') form.disability_types = []
})

watch(() => form.receives_social_benefit, (value) => {
  if (value !== 'sim') form.social_benefit_name = ''
})

async function onCepBlur() {
  const result = await fetchCep(form.cep)
  if (result) {
    form.address = result.logradouro
    form.neighborhood = result.bairro
    form.city = result.localidade
    form.state = result.uf
  }
}

async function submit() {
  if (form.password !== form.password_confirmation) {
    error.value = 'As senhas não coincidem.'
    return
  }
  if (form.has_disability === 'sim' && !form.disability_types.length) {
    error.value = 'Informe o tipo de deficiência.'
    return
  }
  if (form.receives_social_benefit === 'sim' && !form.social_benefit_name.trim()) {
    error.value = 'Informe o nome do benefício social.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const hasDisability = form.has_disability === 'sim'
    const receivesBenefit = form.receives_social_benefit === 'sim'
    await auth.register({
      ...form,
      social_name: form.social_name || null,
      father_name: form.father_name || null,
      has_disability: hasDisability,
      disability_types: hasDisability ? form.disability_types : [],
      registered_cadunico: form.registered_cadunico === 'sim',
      receives_social_benefit: receivesBenefit,
      social_benefit_name: receivesBenefit ? form.social_benefit_name : null,
      origem: route.query.origem as string || undefined,
    })
    await navigateTo('/conta')
  } catch (e: any) {
    const msg = e?.data?.message
    const errors = e?.data?.errors
    if (errors) {
      const first = Object.values(errors).flat()[0]
      error.value = (first as string) || msg || 'Erro ao cadastrar. Verifique os dados.'
    } else {
      error.value = msg || 'Erro ao cadastrar. Verifique os dados.'
    }
  } finally {
    loading.value = false
  }
}
</script>
