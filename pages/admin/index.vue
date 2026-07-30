<template>
  <div>
    <AdminHeader :title="headerTitle" />

    <p v-if="data?.profile_label" class="text-sm text-muted -mt-4 mb-6">
      Visão do perfil <span class="font-medium text-primary">{{ data.profile_label }}</span>
    </p>

    <div v-if="!hasAnySection" class="bg-white rounded-lg shadow p-8 text-center text-muted">
      Seu perfil ainda não tem módulos liberados. Peça a um administrador para ajustar o acesso.
    </div>

    <!-- Qualificação / Inscrições -->
    <section v-if="data?.enrollments" class="mb-10">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 class="text-lg font-semibold text-primary">Qualificação</h2>
          <p class="text-sm text-muted">Inscrições e acompanhamento de cursos</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink v-if="auth.hasModule('enrollments')" to="/admin/inscricoes" class="btn text-sm py-2">Inscrições</NuxtLink>
          <NuxtLink v-if="auth.hasModule('courses')" to="/admin/cursos" class="btn-outline text-sm py-2">Cursos</NuxtLink>
          <NuxtLink v-if="auth.hasModule('citizens')" to="/admin/cidadaos" class="btn-outline text-sm py-2">Cidadãos</NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Total inscrições</p>
          <p class="text-3xl font-bold text-primary">{{ data.enrollments.totals?.total || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Pendentes</p>
          <p class="text-3xl font-bold text-yellow-600">{{ data.enrollments.totals?.pending || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Esta semana</p>
          <p class="text-3xl font-bold text-accent">{{ data.enrollments.totals?.week || 0 }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Este mês</p>
          <p class="text-3xl font-bold text-primary">{{ data.enrollments.totals?.month || 0 }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-primary mb-4">Inscrições por curso</h3>
          <div v-if="!data.enrollments.by_course?.length" class="text-sm text-muted">Nenhuma inscrição ainda.</div>
          <div v-else class="space-y-2">
            <div v-for="item in data.enrollments.by_course" :key="item.title" class="flex items-center gap-3">
              <div class="flex-1 text-sm truncate">{{ item.title }}</div>
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" :style="{ width: `${(item.total / maxCurso) * 100}%` }" />
              </div>
              <span class="text-sm font-medium w-8">{{ item.total }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-primary mb-4">Últimas inscrições</h3>
          <div v-if="!data.enrollments.recent?.length" class="text-sm text-muted">Nenhuma inscrição recente.</div>
          <div v-else class="space-y-3">
            <NuxtLink
              v-for="item in data.enrollments.recent"
              :key="item.id"
              :to="`/admin/inscricoes/${item.id}`"
              class="flex justify-between items-center py-2 border-b last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded"
            >
              <span class="text-sm">{{ item.citizen }}</span>
              <EnrollmentStatusBadge :status="item.status" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Captação / Empresas e vagas -->
    <section v-if="data?.capture">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 class="text-lg font-semibold text-primary">Captação</h2>
          <p class="text-sm text-muted">Empresas e vagas de emprego</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink v-if="auth.hasModule('companies')" to="/admin/empresas" class="btn text-sm py-2">Empresas</NuxtLink>
          <NuxtLink v-if="auth.hasModule('job_vacancies')" to="/admin/vagas-emprego" class="btn-outline text-sm py-2">Vagas</NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div v-if="data.capture.totals?.companies != null" class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Empresas</p>
          <p class="text-3xl font-bold text-primary">{{ data.capture.totals.companies }}</p>
          <p class="text-xs text-muted mt-1">+{{ data.capture.totals.companies_week || 0 }} esta semana</p>
        </div>
        <div v-if="data.capture.totals?.vacancies != null" class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Total de vagas</p>
          <p class="text-3xl font-bold text-primary">{{ data.capture.totals.vacancies }}</p>
          <p class="text-xs text-muted mt-1">+{{ data.capture.totals.vacancies_week || 0 }} esta semana</p>
        </div>
        <div v-if="data.capture.totals?.vacancies_pending != null" class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Vagas pendentes</p>
          <p class="text-3xl font-bold text-yellow-600">{{ data.capture.totals.vacancies_pending }}</p>
        </div>
        <div v-if="data.capture.totals?.vacancies_approved != null" class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-muted">Vagas aprovadas</p>
          <p class="text-3xl font-bold text-green-700">{{ data.capture.totals.vacancies_approved }}</p>
        </div>
      </div>

      <div v-if="auth.hasModule('job_vacancies')" class="bg-white rounded-lg shadow p-6">
        <h3 class="font-semibold text-primary mb-4">Últimas vagas</h3>
        <div v-if="!data.capture.recent_vacancies?.length" class="text-sm text-muted">Nenhuma vaga cadastrada.</div>
        <div v-else class="space-y-3">
          <NuxtLink
            v-for="item in data.capture.recent_vacancies"
            :key="item.id"
            :to="`/admin/vagas-emprego/${item.id}`"
            class="flex justify-between items-center gap-3 py-2 border-b last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded"
          >
            <div class="min-w-0">
              <p class="text-sm font-medium truncate">{{ item.job_title }}</p>
              <p class="text-xs text-muted truncate">{{ item.company || '—' }}</p>
            </div>
            <JobVacancyStatusBadge :status="item.status" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const auth = useAuthStore()
const data = ref<any>(null)

const headerTitle = computed(() => {
  const label = data.value?.profile_label
  if (label === 'Captação') return 'Dashboard — Captação'
  if (label === 'Qualificação') return 'Dashboard — Qualificação'
  return 'Dashboard'
})

const hasAnySection = computed(() => !!(data.value?.enrollments || data.value?.capture))
const maxCurso = computed(() => Math.max(...(data.value?.enrollments?.by_course?.map((c: any) => c.total) || [1]), 1))

onMounted(async () => {
  data.value = await useApi('/admin/dashboard')
})
</script>
