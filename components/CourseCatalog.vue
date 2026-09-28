<template>
  <section :class="embedded ? 'pb-0' : 'container mx-auto px-4 py-10 lg:py-14 pb-20'">
    <RevealOnScroll v-if="showHeader">
      <div class="mb-8">
        <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Catálogo</p>
        <h2 class="section-title">
          Cursos
        </h2>
        <p class="text-muted mt-2">
          <span v-if="!loading">{{ totalCount }} curso(s) encontrado(s)</span>
        </p>
      </div>
    </RevealOnScroll>

    <RevealOnScroll v-if="!showHeader">
      <p class="text-muted mb-8">
        <span v-if="!loading">{{ totalCount }} curso(s) encontrado(s)</span>
      </p>
    </RevealOnScroll>

    <RevealOnScroll :delay="showHeader ? 100 : 0">
      <div class="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start">
        <div>
          <p class="text-xs font-medium text-muted uppercase tracking-wide mb-3">Trilha</p>
          <FilterPills v-model="filters.trilha" :options="trilhaOptions" />
        </div>
        <div>
          <p class="text-xs font-medium text-muted uppercase tracking-wide mb-3">Modalidade</p>
          <FilterPills v-model="filters.modalidade" :options="modalidadeOptions" />
        </div>
        <div>
          <p class="text-xs font-medium text-muted uppercase tracking-wide mb-3">Status</p>
          <FilterPills v-model="filters.inscricao" :options="inscricaoOptions" />
        </div>
      </div>
    </RevealOnScroll>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in skeletonCount" :key="i" class="skeleton h-80" />
    </div>

    <div v-else-if="displayCourses.length === 0" class="text-center py-20 card-modern">
      <div class="text-5xl mb-4 opacity-30">🔍</div>
      <p class="text-lg font-medium text-primary">Nenhum curso encontrado</p>
      <p class="text-muted text-sm mt-2">Tente alterar os filtros ou volte mais tarde.</p>
      <button type="button" class="btn btn-outline mt-6" @click="clearFilters">Limpar filtros</button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RevealOnScroll
        v-for="(course, i) in displayCourses"
        :key="course.id"
        :delay="(i % 3) * 80"
      >
        <CourseCard :course="course" />
      </RevealOnScroll>
    </div>

    <div
      v-if="showPagination && totalPages > 1"
      class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <button
        type="button"
        class="btn btn-outline text-sm py-2 px-5"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        Anterior
      </button>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <button
          v-for="p in totalPages"
          :key="p"
          type="button"
          class="min-w-[2.5rem] h-10 rounded-xl text-sm font-semibold transition-colors"
          :class="p === currentPage ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-primary hover:bg-primary/5'"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
      </div>
      <button
        type="button"
        class="btn btn-outline text-sm py-2 px-5"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Próxima
      </button>
    </div>

    <div v-if="showViewAllLink" class="mt-10 text-center">
      <NuxtLink :to="viewAllTo" class="btn btn-outline">Ver todos os cursos</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { loadTracks, trackPresentation } from '~/utils/tracks'

const props = withDefaults(
  defineProps<{
    /** Itens por página (0 = sem paginação) */
    perPage?: number
    /** Limite na home sem paginação */
    previewLimit?: number
    showHeader?: boolean
    showPagination?: boolean
    showViewAllLink?: boolean
    embedded?: boolean
    syncQuery?: boolean
    initialTrilha?: string
    initialModalidade?: string
    /** '' = todas, abertas ou encerradas */
    initialInscricao?: '' | 'abertas' | 'encerradas'
  }>(),
  {
    perPage: 0,
    previewLimit: 0,
    showHeader: true,
    showPagination: false,
    showViewAllLink: false,
    embedded: false,
    syncQuery: false,
    initialInscricao: '',
  },
)

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const currentPage = ref(1)

function initialInscricaoFromRoute(): '' | 'abertas' | 'encerradas' {
  if (!props.syncQuery) return props.initialInscricao
  const value = route.query.inscricao
  if (value === 'todas') return ''
  if (value === 'abertas' || value === 'encerradas') return value
  return props.initialInscricao
}

const filters = reactive({
  trilha: props.initialTrilha || (props.syncQuery ? (route.query.trilha as string) : '') || '',
  modalidade: props.initialModalidade || (props.syncQuery ? (route.query.modalidade as string) : '') || '',
  inscricao: initialInscricaoFromRoute(),
})

const trilhaOptions = ref([
  { label: 'Todas', value: '', icon: '✨' },
])

const modalidadeOptions = [
  { label: 'Todas', value: '', icon: '🎯' },
  { label: 'Presencial', value: 'presencial', icon: '🏫' },
  { label: 'Online', value: 'online', icon: '💻' },
  { label: 'EAD', value: 'ead', icon: '🌐' },
]

const inscricaoOptions = [
  { label: 'Todos', value: '', icon: '✨' },
  { label: 'Inscrições abertas', value: 'abertas', icon: '✅' },
  { label: 'Inscrições encerradas', value: 'encerradas', icon: '🔒' },
]

function catalogPath() {
  const params = new URLSearchParams()
  if (filters.trilha) params.set('trilha', filters.trilha)
  if (filters.modalidade) params.set('modalidade', filters.modalidade)
  if (filters.inscricao) params.set('inscricao', filters.inscricao)
  const qs = params.toString()
  return `/cursos${qs ? `?${qs}` : ''}`
}

const viewAllTo = computed(() => catalogPath())

async function fetchCoursesList() {
  const path = catalogPath()
  const publicReq = useApiPublic<any[]>(path).catch(() => [] as any[])
  if (import.meta.client) {
    try {
      return await useApi<any[]>(path)
    } catch {
      return await publicReq
    }
  }
  return await publicReq
}

const { data: coursesData, pending: loading, refresh } = await useAsyncData(
  () => `public-courses:${filters.trilha}:${filters.modalidade}:${filters.inscricao}`,
  fetchCoursesList,
)

const courses = computed(() => {
  const list = coursesData.value ?? []
  if (filters.inscricao === 'abertas') {
    return list.filter((course) => course.enrollment_status !== 'encerrada')
  }
  if (filters.inscricao === 'encerradas') {
    return list.filter((course) => course.enrollment_status === 'encerrada')
  }
  return list
})

const totalCount = computed(() => courses.value.length)

const paginatedCourses = computed(() => {
  if (!props.perPage || props.perPage <= 0) return courses.value
  const start = (currentPage.value - 1) * props.perPage
  return courses.value.slice(start, start + props.perPage)
})

const displayCourses = computed(() => {
  if (props.previewLimit > 0) return courses.value.slice(0, props.previewLimit)
  return paginatedCourses.value
})

const totalPages = computed(() => {
  if (!props.perPage || props.perPage <= 0) return 1
  return Math.max(1, Math.ceil(courses.value.length / props.perPage))
})

const skeletonCount = computed(() => props.perPage > 0 ? Math.min(props.perPage, 6) : 3)

watch(filters, () => {
  currentPage.value = 1
  syncQueryToRoute()
  refresh()
}, { deep: true })

if (props.syncQuery) {
  watch(
    () => route.query.page,
    (p) => {
      const page = Number(p) || 1
      if (page !== currentPage.value) currentPage.value = Math.min(Math.max(1, page), totalPages.value)
    },
  )
}

onMounted(async () => {
  if (props.syncQuery && route.query.page) {
    currentPage.value = Math.max(1, Number(route.query.page) || 1)
  }
  try {
    const tracks = await loadTracks()
    trilhaOptions.value = [
      { label: 'Todas', value: '', icon: '✨' },
      ...tracks.map((t, index) => {
        const card = trackPresentation(t, index)
        return { label: card.title, value: t.slug, icon: card.icon }
      }),
    ]
  } catch {
    // fallback já em loadTracks
  }
  if (auth.isLoggedIn) {
    await refresh()
  }
})

function clearFilters() {
  filters.trilha = ''
  filters.modalidade = ''
  filters.inscricao = ''
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  syncQueryToRoute()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function syncQueryToRoute() {
  if (!props.syncQuery) return
  const query: Record<string, string> = {}
  if (filters.trilha) query.trilha = filters.trilha
  if (filters.modalidade) query.modalidade = filters.modalidade
  if (filters.inscricao) query.inscricao = filters.inscricao
  else if (props.initialInscricao) query.inscricao = 'todas'
  if (currentPage.value > 1) query.page = String(currentPage.value)
  router.replace({ query })
}
</script>
