<template>
  <form class="space-y-6" @submit.prevent="save">
    <FormSection
      title="Dados pessoais"
      description="Informações básicas. CPF e e-mail não podem ser alterados aqui."
      emoji="👤"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="form-label">Nome completo *</label>
          <input v-model="form.name" type="text" required class="input-modern" />
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Nome social</label>
          <input v-model="form.social_name" type="text" class="input-modern" placeholder="Opcional" />
        </div>
        <div>
          <label class="form-label">E-mail</label>
          <input :value="auth.user?.email" type="email" class="input-modern bg-gray-50 text-muted" disabled />
          <p class="text-xs text-muted mt-1.5">
            Para trocar o e-mail, use
            <NuxtLink to="/conta/seguranca" class="text-accent font-semibold">Senha e e-mail</NuxtLink>.
          </p>
        </div>
        <div>
          <label class="form-label">CPF</label>
          <input :value="auth.user?.cpf || '—'" class="input-modern bg-gray-50 text-muted" disabled />
          <p class="text-xs text-muted mt-1.5">O CPF não pode ser alterado após o cadastro.</p>
        </div>
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
          <input v-model="form.birthplace" type="text" required class="input-modern" />
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
          <input v-model="form.rg_issuer" type="text" required class="input-modern" />
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
            <input v-model="form.social_benefit_name" type="text" required class="input-modern" />
          </div>
        </div>
      </div>
    </FormSection>

    <FormSection
      title="Contato"
      description="Telefone usado para comunicação sobre turmas e inscrições."
      emoji="📞"
      icon-bg="bg-gradient-to-br from-accent to-h3"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="form-label">Telefone *</label>
          <input v-model="form.phone" v-maska data-maska="(##) #####-####" required class="input-modern" />
        </div>
        <div>
          <label class="form-label">Telefone de emergência / pessoa de contato *</label>
          <input v-model="form.emergency_phone" v-maska data-maska="(##) #####-####" required class="input-modern" />
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
          <label class="form-label">Número *</label>
          <input v-model="form.number" type="text" required class="input-modern" />
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Bairro *</label>
          <input v-model="form.neighborhood" type="text" required class="input-modern" />
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Prefeitura-bairro *</label>
          <select v-model="form.prefeitura_bairro" required class="input-modern">
            <option value="">Selecione...</option>
            <option v-for="opt in PREFEITURAS_BAIRRO" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Complemento</label>
          <input v-model="form.complement" type="text" class="input-modern" />
        </div>
        <div class="md:col-span-3">
          <label class="form-label">Cidade *</label>
          <input v-model="form.city" type="text" required class="input-modern" />
        </div>
        <div class="md:col-span-3">
          <label class="form-label">Estado *</label>
          <select v-model="form.state" required class="input-modern">
            <option value="">UF</option>
            <option v-for="uf in UFS" :key="uf" :value="uf">{{ uf }}</option>
          </select>
        </div>
      </div>
    </FormSection>

    <div class="card-flat p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-muted">As alterações valem para inscrições e comunicação da plataforma.</p>
      <button type="submit" class="btn py-3 px-8" :disabled="saving">
        {{ saving ? 'Salvando…' : 'Salvar perfil' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  DEFICIENCIAS,
  ESCOLARIDADES,
  IDENTIDADES_GENERO,
  ORIENTACOES_SEXUAIS,
  PREFEITURAS_BAIRRO,
  RACAS,
  SEXOS,
  UFS,
  boolToSimNao,
  toDateInput,
} from '~/utils/citizenProfile'
import { apiErrorMessage } from '~/utils/apiError'
import type { User } from '~/stores/auth'
import FormSection from '~/components/FormSection.vue'

usePageSeo({
  title: 'Meu perfil',
  description: 'Atualize seus dados cadastrais no Treinar para Empregar.',
  path: '/conta/perfil',
  noindex: true,
})

const auth = useAuthStore()
const dialog = useDialog()
const { loading: cepLoading, error: cepError, fetchCep } = useCep()

const saving = ref(false)
const form = reactive(emptyForm())

function emptyForm() {
  return {
    name: '',
    social_name: '',
    gender: '',
    sexual_orientation: '',
    gender_identity: '',
    race: '',
    birth_date: '',
    birthplace: '',
    rg: '',
    rg_issue_date: '',
    rg_issuer: '',
    education: '',
    mother_name: '',
    father_name: '',
    has_disability: 'nao' as 'sim' | 'nao',
    disability_types: [] as string[],
    registered_cadunico: 'nao' as 'sim' | 'nao',
    receives_social_benefit: 'nao' as 'sim' | 'nao',
    social_benefit_name: '',
    phone: '',
    emergency_phone: '',
    cep: '',
    address: '',
    number: '',
    neighborhood: '',
    prefeitura_bairro: '',
    city: '',
    state: '',
    complement: '',
  }
}

function fillFromUser(user: User | null) {
  if (!user) return
  form.name = user.name || ''
  form.social_name = user.social_name || ''
  form.gender = user.gender || ''
  form.sexual_orientation = user.sexual_orientation || ''
  form.gender_identity = user.gender_identity || ''
  form.race = user.race || ''
  form.birth_date = toDateInput(user.birth_date)
  form.birthplace = user.birthplace || ''
  form.rg = user.rg || ''
  form.rg_issue_date = toDateInput(user.rg_issue_date)
  form.rg_issuer = user.rg_issuer || ''
  form.education = user.education || ''
  form.mother_name = user.mother_name || ''
  form.father_name = user.father_name || ''
  form.has_disability = boolToSimNao(user.has_disability)
  form.disability_types = Array.isArray(user.disability_types) ? [...user.disability_types] : []
  form.registered_cadunico = boolToSimNao(user.registered_cadunico)
  form.receives_social_benefit = boolToSimNao(user.receives_social_benefit)
  form.social_benefit_name = user.social_benefit_name || ''
  form.phone = user.phone || ''
  form.emergency_phone = user.emergency_phone || ''
  form.cep = user.cep || ''
  form.address = user.address || ''
  form.number = user.number || ''
  form.neighborhood = user.neighborhood || ''
  form.prefeitura_bairro = user.prefeitura_bairro || ''
  form.city = user.city || ''
  form.state = user.state || ''
  form.complement = user.complement || ''
}

watch(() => auth.user, fillFromUser, { immediate: true })

watch(() => form.has_disability, (value) => {
  if (value !== 'sim') form.disability_types = []
})

watch(() => form.receives_social_benefit, (value) => {
  if (value !== 'sim') form.social_benefit_name = ''
})

onMounted(async () => {
  if (!auth.user) await auth.fetchUser()
  fillFromUser(auth.user)
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

async function save() {
  if (form.has_disability === 'sim' && !form.disability_types.length) {
    await dialog.error('Informe o tipo de deficiência.')
    return
  }
  if (form.receives_social_benefit === 'sim' && !form.social_benefit_name.trim()) {
    await dialog.error('Informe o nome do benefício social.')
    return
  }

  saving.value = true
  try {
    const hasDisability = form.has_disability === 'sim'
    const receivesBenefit = form.receives_social_benefit === 'sim'
    await ensureSanctumCsrf()
    await useApi('/account/profile', {
      method: 'PATCH',
      body: {
        name: form.name,
        social_name: form.social_name || null,
        gender: form.gender,
        sexual_orientation: form.sexual_orientation,
        gender_identity: form.gender_identity,
        race: form.race,
        birth_date: form.birth_date || null,
        birthplace: form.birthplace,
        rg: form.rg,
        rg_issue_date: form.rg_issue_date || null,
        rg_issuer: form.rg_issuer,
        education: form.education,
        mother_name: form.mother_name,
        father_name: form.father_name || null,
        has_disability: hasDisability,
        disability_types: hasDisability ? form.disability_types : [],
        registered_cadunico: form.registered_cadunico === 'sim',
        receives_social_benefit: receivesBenefit,
        social_benefit_name: receivesBenefit ? form.social_benefit_name : null,
        phone: form.phone,
        emergency_phone: form.emergency_phone,
        cep: form.cep,
        address: form.address,
        number: form.number,
        neighborhood: form.neighborhood,
        prefeitura_bairro: form.prefeitura_bairro || null,
        city: form.city,
        state: form.state,
        complement: form.complement || null,
      },
    })
    await auth.fetchUser()
    await dialog.toastSuccess('Perfil atualizado.')
  } catch (e) {
    await dialog.error(apiErrorMessage(e, 'Não foi possível salvar o perfil.'))
  } finally {
    saving.value = false
  }
}
</script>
