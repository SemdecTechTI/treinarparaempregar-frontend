<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 pb-20 max-w-7xl">
    <!-- Voltar -->
    <nav class="mb-6 lg:mb-8">
      <NuxtLink
        to="/cursos"
        class="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar aos cursos
      </NuxtLink>
    </nav>

    <div v-if="loading" class="grid lg:grid-cols-3 gap-6 lg:gap-8">
      <div class="skeleton h-72 lg:col-span-1 rounded-2xl" />
      <div class="skeleton h-96 lg:col-span-2 rounded-2xl" />
    </div>

    <div v-else-if="course" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <!-- Sidebar -->
      <aside class="lg:col-span-4 xl:col-span-3">
        <div class="card-flat p-5 lg:p-6 space-y-4 lg:sticky lg:top-28">
          <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
              {{ course.partner?.name?.charAt(0) }}
            </div>
            <div class="min-w-0">
              <p class="text-xs text-muted uppercase tracking-wide">Parceiro</p>
              <p class="font-semibold text-primary truncate">{{ course.partner?.name }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="item in sidebarItems" :key="item.label" class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-accent shrink-0">
                <span class="text-sm">{{ item.icon }}</span>
              </div>
              <div>
                <p class="text-xs text-muted uppercase tracking-wide">{{ item.label }}</p>
                <p class="font-medium text-sm mt-0.5">{{ item.value }}</p>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <InscricaoStatusBadge :status="course.inscricao_status" />
          </div>
        </div>
      </aside>

      <!-- Conteúdo principal -->
      <div class="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 lg:gap-7">
        <header class="space-y-3 pb-1">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <span class="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {{ trilhaLabel }}
            </span>
            <InscricaoStatusBadge :status="course.inscricao_status" />
          </div>
          <h1 class="text-[#2d3f58] leading-tight">{{ course.titulo }}</h1>
          <p v-if="course.resumo" class="text-muted leading-relaxed text-base lg:text-lg max-w-3xl">
            {{ course.resumo }}
          </p>
          <div v-if="course.descricao" class="prose prose-sm lg:prose-base max-w-3xl text-muted leading-relaxed whitespace-pre-line">
            {{ course.descricao }}
          </div>
        </header>

        <!-- Informações do curso -->
        <section v-if="hasInfoCards" class="flex flex-col gap-4">
          <div v-if="course.data_curso || course.local" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-if="course.data_curso" class="card-flat p-5 lg:p-6">
              <p class="text-xs font-semibold text-accent uppercase tracking-wide mb-2">📅 Data do curso</p>
              <p class="font-medium text-sm lg:text-base leading-snug">{{ formatDate(course.data_curso) }}</p>
            </div>
            <div v-if="course.local" class="card-flat p-5 lg:p-6">
              <p class="text-xs font-semibold text-accent uppercase tracking-wide mb-2">📍 Local</p>
              <p class="font-medium text-sm lg:text-base leading-snug">{{ course.local }}</p>
            </div>
          </div>
          <div v-if="course.inscricao_fim" class="card-flat p-5 lg:p-6">
            <p class="text-xs font-semibold text-accent uppercase tracking-wide mb-2">📋 Inscrições até</p>
            <p class="font-medium text-sm lg:text-base leading-snug">{{ formatDateTime(course.inscricao_fim) }}</p>
          </div>
        </section>

        <section v-if="course.pre_requisitos?.length" class="card-flat p-5 lg:p-6">
          <h3 class="font-semibold text-primary mb-4 text-lg">Pré-requisitos</h3>
          <ul class="space-y-3">
            <li v-for="item in course.pre_requisitos" :key="item" class="flex items-start gap-3 text-sm lg:text-base leading-relaxed">
              <span class="w-6 h-6 mt-0.5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs shrink-0">✓</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <section v-if="course.documentos_necessarios?.length" class="card-flat p-5 lg:p-6">
          <h3 class="font-semibold text-primary mb-4 text-lg">Documentos para inscrição</h3>
          <ul class="space-y-3">
            <li v-for="item in course.documentos_necessarios" :key="item" class="flex items-start gap-3 text-sm lg:text-base leading-relaxed">
              <span class="w-6 h-6 mt-0.5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">📄</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <section class="card-flat p-6 lg:p-8 text-center">
          <div v-if="userEnrollment" class="text-accent font-semibold text-sm lg:text-base py-2">
            Você já possui inscrição neste curso (status: {{ userEnrollment.status }}).
          </div>

          <template v-else-if="auth.isLoggedIn">
            <button
              v-if="canEnroll"
              type="button"
              class="btn px-10 py-4 text-base rounded-xl mt-2"
              @click="showEnrollmentModal = true"
            >
              Inscrever-se neste curso
            </button>
            <p v-else class="text-muted text-sm lg:text-base max-w-lg mx-auto leading-relaxed py-2">
              {{ enrollBlockedMessage }}
            </p>
          </template>

          <NuxtLink
            v-else
            :to="`/cadastrar?origem=${slug}`"
            class="btn px-10 py-4 text-base rounded-xl inline-flex mt-2"
          >
            Criar minha conta gratuitamente
          </NuxtLink>
        </section>
      </div>
    </div>

    <EnrollmentModal
      v-if="course"
      v-model:open="showEnrollmentModal"
      :course-id="course.id"
      :course-title="course.titulo"
      :custom-fields="customFields"
      :documents="course.documentos_upload || []"
      :link-inscricao="course.link_inscricao"
    />
    <ModalVagasEsgotadas v-if="course" v-model:open="showVagasModal" :titulo="course.titulo" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const auth = useAuthStore()

const course = ref<any>(null)
const customFields = ref<any[]>([])
const userEnrollment = ref<any>(null)
const loading = ref(true)
const showEnrollmentModal = ref(false)
const showVagasModal = ref(false)

const trilhaLabels: Record<string, string> = {
  base: 'Base (SIMM Prepara)',
  saude: 'Saúde',
  servicos: 'Serviços',
  tecnicos: 'Construção Civil',
}
const trilhaLabel = computed(() => trilhaLabels[course.value?.trilha] || course.value?.trilha)

const canEnroll = computed(() => {
  if (!course.value) return false
  return course.value.inscricao_status === 'disponivel'
})

const enrollBlockedMessage = computed(() => {
  if (!course.value) return ''
  if (course.value.inscricao_status === 'esgotado') return 'As vagas para este curso estão esgotadas.'
  if (course.value.inscricao_status === 'encerrada') return 'As inscrições para este curso estão encerradas.'
  return 'Não é possível inscrever-se neste curso no momento.'
})

const hasInfoCards = computed(() =>
  course.value?.data_curso || course.value?.inscricao_fim || course.value?.local,
)

function modalidadeLabel(modalidade?: string) {
  if (modalidade === 'ead') return 'EAD'
  if (modalidade === 'presencial') return 'Presencial'
  return modalidade || '—'
}

const sidebarItems = computed(() => {
  if (!course.value) return []

  const items: { icon: string; label: string; value: string }[] = [
    { icon: '🎯', label: 'Trilha', value: trilhaLabel.value },
    ...(course.value.carga_horaria ? [{ icon: '⏱', label: 'Carga horária', value: course.value.carga_horaria }] : []),
    { icon: '🏫', label: 'Modalidade', value: modalidadeLabel(course.value.modalidade) },
  ]

  if (!course.value.ocultar_vagas_totais) {
    const label =
      course.value.vagas_totais === 0
        ? 'Ilimitadas'
        : `${course.value.vagas_totais} vagas`
    items.push({ icon: '👥', label: 'Vagas totais', value: label })
  }

  if (!course.value.ocultar_vagas_disponiveis) {
    const label =
      course.value.vagas_totais === 0
        ? 'Ilimitadas'
        : `${course.value.vagas_disponiveis} vagas`
    items.push({ icon: '✅', label: 'Vagas disponíveis', value: label })
  }

  return items
})

watch(course, (c) => {
  if (!c) return
  usePageSeo({
    title: c.titulo,
    description: c.resumo || c.descricao?.slice(0, 160) || undefined,
    image: c.imagem,
    path: `/cursos/${c.slug}`,
  })
})

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function load() {
  loading.value = true
  try {
    const data = await useApi<{ course: any; custom_fields: any[]; user_enrollment: any }>(`/cursos/${slug}`)
    course.value = data.course
    customFields.value = data.custom_fields || []
    userEnrollment.value = data.user_enrollment
  } catch {
    const data = await useApiPublic<any>(`/cursos/${slug}`)
    course.value = data.course
    customFields.value = data.custom_fields || []
    userEnrollment.value = data.user_enrollment
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
