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
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                :class="item.highlight ? 'bg-orange-100 text-orange-600' : 'bg-surface text-accent'"
              >
                <span class="text-sm">{{ item.icon }}</span>
              </div>
              <div>
                <p class="text-xs text-muted uppercase tracking-wide">{{ item.label }}</p>
                <p class="font-medium text-sm mt-0.5" :class="item.highlight ? 'text-orange-700 font-semibold' : ''">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100 space-y-3">
            <InscricaoStatusBadge :status="course.enrollment_status" />
            <div v-if="showReservaCounter" class="rounded-xl border border-orange-300 bg-orange-50 p-3">
              <p class="text-sm font-semibold text-orange-700">
                ⚠️ Vagas de reserva disponíveis
              </p>
              <p class="text-xs text-orange-700/80 mt-1">
                As vagas regulares foram preenchidas. Novas inscrições entram na lista de reserva.
              </p>
            </div>
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
            <InscricaoStatusBadge :status="course.enrollment_status" />
            <span
              v-if="course.women_only"
              class="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700"
            >
              Exclusivo para mulheres
            </span>
            <span
              v-if="course.adults_only"
              class="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"
            >
              Maiores de 18 anos
            </span>
          </div>
          <h1 class="text-[#2d3f58] leading-tight">{{ course.title }}</h1>
          <p v-if="course.summary" class="text-muted leading-relaxed text-base lg:text-lg max-w-3xl">
            {{ course.summary }}
          </p>
          <div v-if="course.description" class="prose prose-sm lg:prose-base max-w-3xl text-muted leading-relaxed whitespace-pre-line">
            {{ course.description }}
          </div>
        </header>

        <!-- Informações do curso -->
        <section v-if="hasInfoCards" class="flex flex-col gap-4">
          <div v-if="coursePeriodLabel || course.location" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-if="coursePeriodLabel" class="card-flat p-5 lg:p-6">
              <p class="text-xs font-semibold text-accent uppercase tracking-wide mb-2">📅 Período do curso</p>
              <p class="font-medium text-sm lg:text-base leading-snug">{{ coursePeriodLabel }}</p>
            </div>
            <div v-if="course.location" class="card-flat p-5 lg:p-6">
              <p class="text-xs font-semibold text-accent uppercase tracking-wide mb-2">📍 Local</p>
              <p class="font-medium text-sm lg:text-base leading-snug">{{ course.location }}</p>
            </div>
          </div>
          <div v-if="course.enrollment_end" class="card-flat p-5 lg:p-6">
            <p class="text-xs font-semibold text-accent uppercase tracking-wide mb-2">📋 Inscrições até</p>
            <p class="font-medium text-sm lg:text-base leading-snug">{{ formatDateTime(course.enrollment_end) }}</p>
          </div>
        </section>

        <section v-if="course.prerequisites?.length" class="card-flat p-5 lg:p-6">
          <h3 class="font-semibold text-primary mb-4 text-lg">Pré-requisitos</h3>
          <ul class="space-y-3">
            <li v-for="item in course.prerequisites" :key="item" class="flex items-start gap-3 text-sm lg:text-base leading-relaxed">
              <span class="w-6 h-6 mt-0.5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs shrink-0">✓</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <section v-if="course.required_documents?.length" class="card-flat p-5 lg:p-6">
          <h3 class="font-semibold text-primary mb-4 text-lg">Documentos para inscrição</h3>
          <ul class="space-y-3">
            <li v-for="item in course.required_documents" :key="item" class="flex items-start gap-3 text-sm lg:text-base leading-relaxed">
              <span class="w-6 h-6 mt-0.5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">📄</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <!-- Vídeos (curso online + inscrito) -->
        <section v-if="isOnline && userEnrollment && videos.length" class="card-flat p-5 lg:p-6 space-y-4">
          <ProgressBar :percent="userEnrollment.progress_percent || 0" class="max-w-md" />
          <CourseVideoList
            :videos="videos"
            :course-slug="slug"
          />
          <div class="pt-2 text-center sm:text-left">
            <NuxtLink
              v-if="firstIncompleteVideo"
              :to="`/cursos/${slug}/video/${firstIncompleteVideo.id}`"
              class="btn"
            >
              {{ (userEnrollment.progress_percent || 0) > 0 ? 'Continuar assistindo' : 'Assistir primeiro vídeo' }}
            </NuxtLink>
          </div>
        </section>

        <section class="card-flat p-6 lg:p-8 text-center">
          <div v-if="userEnrollment" class="text-accent font-semibold text-sm lg:text-base py-2">
            Você já possui inscrição neste curso (status: {{ userEnrollment.status }}).
          </div>

          <template v-else-if="auth.isLoggedIn">
            <div v-if="isReserva" class="max-w-lg mx-auto mb-4 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-left">
              <p class="text-sm font-semibold text-orange-700">⚠️ Vagas de reserva</p>
              <p class="text-sm text-orange-700/90 mt-1">
                As vagas regulares deste curso já foram preenchidas. Ao se inscrever, você entrará na
                <strong>lista de reserva</strong> e será chamado caso surja uma vaga.
              </p>
            </div>
            <button
              v-if="canEnroll"
              type="button"
              class="btn px-10 py-4 text-base rounded-xl mt-2"
              @click="showEnrollmentModal = true"
            >
              {{ isReserva ? 'Inscrever-se na lista de reserva' : 'Inscrever-se neste curso' }}
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
      :course-title="course.title"
      :custom-fields="customFields"
      :documents="course.documents_for_upload || []"
      :link-inscricao="course.enrollment_link"
      :stay-on-page="isOnline"
      @enrolled="load"
    />
    <ModalVagasEsgotadas v-if="course" v-model:open="showVagasModal" :title="course.title" />
  </div>
</template>

<script setup lang="ts">
import { loadTracks } from '~/utils/tracks'

const route = useRoute()
const slug = route.params.slug as string
const auth = useAuthStore()

const course = ref<any>(null)
const videos = ref<any[]>([])
const customFields = ref<any[]>([])
const userEnrollment = ref<any>(null)
const loading = ref(true)
const showEnrollmentModal = ref(false)
const showVagasModal = ref(false)

const trilhaLabels = ref<Record<string, string>>({})
const trilhaLabel = computed(() => trilhaLabels.value[course.value?.track] || course.value?.track)

const isOnline = computed(() => course.value?.modality === 'online')

const canEnroll = computed(() => {
  if (!course.value) return false
  if (!['disponivel', 'reserva'].includes(course.value.enrollment_status)) return false
  if (course.value.adults_only && auth.isLoggedIn && !auth.isAdult) return false
  return true
})

const isReserva = computed(() => course.value?.enrollment_status === 'reserva')

const enrollBlockedMessage = computed(() => {
  if (!course.value) return ''
  if (course.value.adults_only && auth.isLoggedIn && !auth.isAdult) {
    return 'Este curso é exclusivo para maiores de 18 anos.'
  }
  if (course.value.enrollment_status === 'esgotado') return 'As vagas para este curso estão esgotadas.'
  if (course.value.enrollment_status === 'encerrada') return 'As inscrições para este curso estão encerradas.'
  return 'Não é possível inscrever-se neste curso no momento.'
})

const coursePeriodLabel = computed(() => {
  const start = course.value?.course_start_date
  const end = course.value?.course_end_date
  if (!start && !end) return ''
  if (start && end) {
    if (start === end) return formatDate(start)
    return `${formatDate(start)} até ${formatDate(end)}`
  }
  if (start) return `A partir de ${formatDate(start)}`
  return `Até ${formatDate(end)}`
})

const hasInfoCards = computed(() =>
  coursePeriodLabel.value || course.value?.enrollment_end || course.value?.location,
)

const firstIncompleteVideo = computed(() => {
  if (!videos.value.length) return null
  const incomplete = videos.value.find((v: any) => !v.progress?.completed)
  return incomplete || videos.value[0]
})

function modalidadeLabel(modalidade?: string) {
  if (modalidade === 'online') return 'Online'
  if (modalidade === 'ead') return 'EAD'
  if (modalidade === 'presencial') return 'Presencial'
  return modalidade || '—'
}

const sidebarItems = computed(() => {
  if (!course.value) return []

  const items: { icon: string; label: string; value: string; highlight?: boolean }[] = [
    { icon: '🎯', label: 'Trilha', value: trilhaLabel.value },
    ...(course.value.workload ? [{ icon: '⏱', label: 'Carga horária', value: course.value.workload }] : []),
    { icon: '🏫', label: 'Modalidade', value: modalidadeLabel(course.value.modality) },
  ]

  if (!course.value.hide_total_vacancies) {
    const label =
      course.value.total_vacancies === 0
        ? 'Ilimitadas'
        : `${course.value.total_vacancies} vagas`
    items.push({ icon: '👥', label: 'Vagas totais', value: label })
  }

  if (!course.value.hide_available_vacancies) {
    if (isReserva.value) {
      items.push({ icon: '⚠️', label: 'Vagas disponíveis', value: 'Vagas de reserva', highlight: true })
    } else {
      const label =
        course.value.total_vacancies === 0
          ? 'Ilimitadas'
          : `${course.value.available_vacancies} vagas`
      items.push({ icon: '✅', label: 'Vagas disponíveis', value: label })
    }
  }

  return items
})

const showReservaCounter = computed(() =>
  isReserva.value && !course.value?.hide_available_vacancies,
)

watch(course, (c) => {
  if (!c) return
  usePageSeo({
    title: c.title,
    description: c.summary || c.description?.slice(0, 160) || undefined,
    image: c.image,
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
    const tracks = await loadTracks()
    trilhaLabels.value = Object.fromEntries(tracks.map(t => [t.slug, t.name]))
    // Com cookies para aplicar restrição de gênero em usuários logados.
    const data = await useApi<{ course: any; custom_fields: any[]; user_enrollment: any; videos?: any[] }>(`/cursos/${slug}`)
    course.value = data.course
    customFields.value = data.custom_fields || []
    userEnrollment.value = data.user_enrollment
    videos.value = data.videos || []
  } catch (e: any) {
    // 404 = curso inexistente ou oculto para este usuário — não tentar de novo sem sessão.
    if (e?.statusCode === 404 || e?.status === 404 || e?.response?.status === 404) {
      course.value = null
      videos.value = []
      return
    }
    try {
      const data = await useApiPublic<any>(`/cursos/${slug}`)
      course.value = data.course
      customFields.value = data.custom_fields || []
      userEnrollment.value = data.user_enrollment
      videos.value = data.videos || []
    } catch {
      course.value = null
      videos.value = []
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
