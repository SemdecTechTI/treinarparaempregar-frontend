<template>
  <div>
    <HeroSection :course-count="courseCount" :track-count="trackCount" />

    <section class="container mx-auto px-4 py-16 lg:py-20">
      <RevealOnScroll>
        <div class="text-center mb-10">
          <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Explore</p>
          <h2 class="section-title">Escolha sua trilha</h2>
          <p class="text-muted mt-3 max-w-xl mx-auto">Cada trilha foi pensada para diferentes perfis e objetivos profissionais.</p>
        </div>
      </RevealOnScroll>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RevealOnScroll v-for="(track, index) in tracks" :key="track.slug" :delay="(index % 4) * 80">
          <TrilhaCard
            :to="track.to"
            :title="track.title"
            :description="track.description"
            :icon="track.icon"
            :gradient-class="track.gradientClass"
          />
        </RevealOnScroll>
      </div>
    </section>

    <section id="cursos" class="container mx-auto px-4">
      <CourseCatalog
        :preview-limit="6"
        show-view-all-link
        embedded
      />
    </section>

    <section class="container mx-auto px-4 pb-20 pt-4">
      <RevealOnScroll>
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-accent p-8 lg:p-12 text-white text-center">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div class="relative z-10 max-w-2xl mx-auto">
            <h2 class="text-2xl lg:text-4xl font-semibold text-white mb-4">Pronto para começar?</h2>
            <p class="text-white/80 mb-8">Cadastre-se gratuitamente e tenha acesso a todos os cursos presenciais e online da plataforma.</p>
            <div class="flex flex-wrap justify-center gap-4">
              <NuxtLink to="/cadastrar" class="btn btn-accent px-8 py-4 text-base rounded-xl">Criar minha conta</NuxtLink>
              <NuxtLink to="/quem-somos" class="btn btn-ghost px-8 py-4 text-base rounded-xl">Saiba mais</NuxtLink>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>

    <BlogHomeSection />
  </div>
</template>

<script setup lang="ts">
import { trackPresentation } from '~/utils/tracks'

const { data: homeTracks } = await usePublicTracks()

const { data: homeCourses } = await useAsyncData('home-course-count', async () => {
  try {
    return await useApiPublic<unknown[]>('/cursos')
  } catch {
    return []
  }
})

const tracks = computed(() => (homeTracks.value ?? []).map((track, index) => trackPresentation(track, index)))
const courseCount = computed(() => homeCourses.value?.length ?? 0)
const trackCount = computed(() => tracks.value.length)

usePageSeo({
  title: 'Cursos gratuitos de qualificação profissional',
  description: 'Cursos presenciais e online gratuitos em Salvador. Inscreva-se no Treinar para Empregar e qualifique-se para o mercado de trabalho.',
  path: '/',
})
</script>
