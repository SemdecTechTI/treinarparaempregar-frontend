<template>
  <div>
    <section class="relative py-12 lg:py-16 overflow-hidden mb-8">
      <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark" />
      <div class="absolute top-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-white !text-3xl lg:!text-5xl font-semibold">{{ info.title }}</h1>
        <p class="text-white/75 mt-3 max-w-xl">{{ info.description }}</p>
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
import { trackPresentation } from '~/utils/tracks'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const legacyTrackSlug: Record<string, string> = {
  softskills: 'servicos',
  carreiras: 'saude',
}

const trackSlug = computed(() => legacyTrackSlug[slug.value] || slug.value)

const { data: trackOptions } = await usePublicTracks()

const info = computed(() => {
  const tracks = trackOptions.value ?? []
  const index = tracks.findIndex(track => track.slug === trackSlug.value)
  const track = index >= 0 ? tracks[index] : null
  if (!track) {
    return { title: 'Trilha', description: 'Cursos desta trilha de formação.' }
  }
  const card = trackPresentation(track, index)
  return { title: card.title, description: card.description }
})

watch(info, (value) => {
  usePageSeo({
    title: value.title,
    description: value.description,
    path: `/trilhas/${slug.value}`,
  })
}, { immediate: true })

const { data: coursesData, pending: loading } = await useAsyncData(
  () => `trilha-courses-${trackSlug.value}`,
  async () => {
    try {
      return await useApiPublic<any[]>(`/cursos?trilha=${trackSlug.value}`)
    } catch {
      return []
    }
  },
)

const courses = computed(() => coursesData.value ?? [])
</script>
