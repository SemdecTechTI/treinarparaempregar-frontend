<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div>
        <h2 class="text-lg font-semibold text-primary">Meus cursos</h2>
        <p class="text-sm text-muted mt-1">Separe por modalidade e acompanhe o status de cada inscrição.</p>
      </div>
      <NuxtLink to="/cursos" class="btn-outline text-sm py-2 px-4 rounded-xl">Explorar catálogo</NuxtLink>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="skeleton h-36 rounded-2xl" />
    </div>

    <div v-else-if="!enrollments.length" class="card-flat p-10 text-center">
      <p class="text-muted">Nenhuma inscrição em cursos ainda.</p>
      <NuxtLink to="/cursos" class="btn mt-4">Ver cursos disponíveis</NuxtLink>
    </div>

    <template v-else>
      <FilterPills v-model="filter" :options="filterOptions" class="mb-6" />

      <div v-if="!visibleGroups.length" class="card-flat p-8 text-center text-muted text-sm">
        Nenhum curso nesta modalidade.
      </div>

      <section v-for="group in visibleGroups" :key="group.key" class="mb-10">
        <h3 class="text-base font-semibold text-[#2d3f58] mb-1">{{ group.title }}</h3>
        <p class="text-sm text-muted mb-4">{{ group.description }}</p>
        <div class="space-y-3">
          <AccountCourseCard
            v-for="item in group.items"
            :key="item.id"
            :enrollment="item"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { loadTracks } from '~/utils/tracks'
import { useCitizenDashboard } from '~/composables/useCitizenDashboard'
import type { CitizenEnrollment } from '~/composables/useCitizenDashboard'
import AccountCourseCard from '~/components/account/AccountCourseCard.vue'
import FilterPills from '~/components/FilterPills.vue'

usePageSeo({
  title: 'Meus cursos',
  description: 'Acompanhe suas inscrições e acesse os cursos do Treinar para Empregar.',
  path: '/conta/cursos',
  noindex: true,
})

const { enrollments, loading, refresh } = useCitizenDashboard()
const filter = ref('')

const filterOptions = [
  { value: '', label: 'Todos' },
  { value: 'online', label: 'Online' },
  { value: 'ead', label: 'EAD' },
  { value: 'presencial', label: 'Presencial' },
]

const groups = [
  { key: 'online', title: 'Cursos online', description: 'Aulas em vídeo para assistir no seu ritmo.' },
  { key: 'ead', title: 'Cursos EAD', description: 'Formação a distância com material do parceiro.' },
  { key: 'presencial', title: 'Cursos presenciais', description: 'Turmas em Salvador, com data e local definidos.' },
]

const grouped = computed(() => {
  return groups.map(group => ({
    ...group,
    items: enrollments.value.filter((e: CitizenEnrollment) => (e.course?.modality || 'presencial') === group.key),
  }))
})

const visibleGroups = computed(() => {
  const list = grouped.value.filter(g => g.items.length)
  if (!filter.value) return list
  return list.filter(g => g.key === filter.value)
})

onMounted(async () => {
  await loadTracks()
  await refresh()
})
</script>
