<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent text-white py-12 lg:py-16">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>
      <div class="container mx-auto px-4 relative z-10 max-w-4xl">
        <p class="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">Cadastro gratuito</p>
        <h1 class="text-white text-3xl lg:text-4xl font-semibold mb-3">Crie sua conta</h1>
        <p class="text-white/85 max-w-xl text-base lg:text-lg">
          Preencha o formulário abaixo e tenha acesso a cursos presenciais e online da Prefeitura de Salvador.
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
      <!-- Steps indicator -->
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
        <!-- Dados pessoais -->
        <FormSection
          title="Dados pessoais"
          description="Informações básicas para o seu perfil na plataforma."
          emoji="👤"
          icon-bg="bg-gradient-to-br from-primary to-primary-light"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="form-label">Nome completo *</label>
              <input v-model="form.name" type="text" required class="input-modern" placeholder="Como consta no documento" />
            </div>
            <div>
              <label class="form-label">Email *</label>
              <input v-model="form.email" type="email" required class="input-modern" placeholder="seu@email.com" />
            </div>
            <div>
              <label class="form-label">CPF *</label>
              <input v-model="form.cpf" v-maska data-maska="###.###.###-##" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Data de nascimento *</label>
              <input v-model="form.birth_date" type="date" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Telefone (WhatsApp) *</label>
              <input v-model="form.phone" v-maska data-maska="(##) #####-####" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Nome da mãe *</label>
              <input v-model="form.mother_name" type="text" required class="input-modern" />
            </div>
            <div>
              <label class="form-label">Nome do pai</label>
              <input v-model="form.father_name" type="text" class="input-modern" />
            </div>
            <div>
              <label class="form-label">Gênero *</label>
              <select v-model="form.gender" required class="input-modern">
                <option value="">Selecione...</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
                <option>Prefiro não dizer</option>
              </select>
            </div>
            <div>
              <label class="form-label">Raça / cor *</label>
              <select v-model="form.race" required class="input-modern">
                <option value="">Selecione...</option>
                <option>Indígena</option>
                <option>Amarela</option>
                <option>Preta</option>
                <option>Branca</option>
                <option>Parda</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Escolaridade *</label>
              <select v-model="form.education" required class="input-modern">
                <option value="">Selecione...</option>
                <option>Fundamental Incompleto</option>
                <option>Fundamental Completo</option>
                <option>Médio Incompleto</option>
                <option>Médio Completo</option>
                <option>Superior Incompleto</option>
                <option>Superior Completo</option>
              </select>
            </div>
          </div>
        </FormSection>

        <!-- Acesso -->
        <FormSection
          title="Acesso à conta"
          description="Crie uma senha segura para entrar na plataforma."
          emoji="🔐"
          icon-bg="bg-gradient-to-br from-accent to-h3"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="form-label">Senha *</label>
              <input v-model="form.password" type="password" required minlength="8" class="input-modern" placeholder="Mínimo 8 caracteres" />
            </div>
            <div>
              <label class="form-label">Confirmar senha *</label>
              <input v-model="form.password_confirmation" type="password" required class="input-modern" placeholder="Repita a senha" />
            </div>
          </div>
          <p class="text-xs text-muted mt-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Use letras, números e evite senhas que você já usa em outros sites.
          </p>
        </FormSection>

        <!-- Endereço -->
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
              <label class="form-label">Número</label>
              <input v-model="form.number" type="text" class="input-modern" />
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

        <!-- Termos + submit -->
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
definePageMeta({ middleware: 'guest' })

const route = useRoute()
const auth = useAuthStore()
const { loading: cepLoading, error: cepError, fetchCep } = useCep()

const steps = ['Dados pessoais', 'Acesso', 'Endereço']
const currentStep = 2

const ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

const form = reactive({
  name: '', email: '', cpf: '', birth_date: '', mother_name: '', father_name: '',
  password: '', password_confirmation: '', gender: '', race: '', education: '',
  phone: '', cep: '', address: '', number: '', neighborhood: '', city: '', state: '', complement: '',
})

const loading = ref(false)
const error = ref('')
const acceptedTerms = ref(false)
const showTermos = ref(false)

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
  loading.value = true
  error.value = ''
  try {
    await auth.register({
      ...form,
      origem: route.query.origem as string || undefined,
    })
    await navigateTo('/conta')
  } catch (e: any) {
    const msg = e?.data?.message
    const errors = e?.data?.errors
    if (errors?.email) error.value = errors.email[0]
    else if (errors?.cpf) error.value = errors.cpf[0]
    else error.value = msg || 'Erro ao cadastrar. Verifique os dados.'
  } finally {
    loading.value = false
  }
}
</script>
