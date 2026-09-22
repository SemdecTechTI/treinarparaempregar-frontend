<template>
  <div>
    <section class="relative py-12 lg:py-16 overflow-hidden mb-8">
      <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark" />
      <div class="absolute top-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-white !text-3xl lg:!text-5xl font-semibold">{{ trilhaInfo.title }}</h1>
        <p class="text-white/75 mt-3 max-w-xl">{{ trilhaInfo.description }}</p>
      </div>
    </section>
    <section class="container mx-auto px-4 pb-16">
      <PageLoading v-if="loading" variant="cards" :rows="6" />
      <div v-else-if="!courses.length" class="text-center py-16 card-modern">Nenhum curso nesta trilha.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard v-for="course in courses" :key="course.id" :course="course" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const trilhaMap: Record<string, { title: string; description: string; trilha: string }> = {
  base: { title: 'SIMM Prepara (Base)', description: 'Cursos de base e preparação para o mercado de trabalho.', trilha: 'base' },
  saude: { title: 'Carreiras — Saúde', description: 'Qualificação para o setor de saúde.', trilha: 'saude' },
  servicos: { title: 'Soft Skills — Serviços', description: 'Competências para o setor de serviços.', trilha: 'servicos' },
  tecnicos: { title: 'Técnicos — Construção Civil', description: 'Cursos técnicos para construção civil.', trilha: 'tecnicos' },
  softskills: { title: 'Soft Skills — Serviços', description: 'Competências para o setor de serviços.', trilha: 'servicos' },
  carreiras: { title: 'Carreiras — Saúde', description: 'Qualificação para o setor de saúde.', trilha: 'saude' },
}

const trilhaInfo = computed(() => trilhaMap[slug.value] || { title: 'Trilha', description: 'Cursos desta trilha de formação.', trilha: slug.value })

usePageSeo({
  title: trilhaInfo.value.title,
  description: trilhaInfo.value.description,
  path: `/trilhas/${slug.value}`,
})

const { data: coursesData, pending: loading } = await useAsyncData(
  () => `trilha-courses-${trilhaInfo.value.trilha}`,
  async () => {
    try {
      return await useApiPublic<any[]>(`/cursos?trilha=${trilhaInfo.value.trilha}`)
    } catch {
      return []
    }
  },
)

const courses = computed(() => coursesData.value ?? [])
</script>
