<template>
  <section class="relative overflow-hidden min-h-[520px] lg:min-h-[600px] flex items-center hero-overlap pt-20">
    <!-- Animated background -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-[#1a3568]" />
    <div class="absolute top-20 -left-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-float" />
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-primary-light/40 rounded-full blur-3xl animate-float-delayed" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse-soft" />

    <!-- Grid pattern -->
    <div
      class="absolute inset-0 opacity-[0.07]"
      style="background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px); background-size: 48px 48px;"
    />

    <div class="container mx-auto px-4 relative z-10 py-16 lg:py-24">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="text-white space-y-6 animate-fade-up">
          <div class="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 text-sm text-white/90">
            <span class="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Programa municipal · Salvador/BA
          </div>

          <h1 class="text-white !text-4xl lg:!text-6xl font-semibold leading-tight">
            Qualificação profissional
            <span class="block text-accent mt-1">gratuita para você</span>
          </h1>

          <p class="text-lg text-white/75 max-w-lg leading-relaxed">
            Cursos presenciais e online com SENAC, SENAI e SIMM Prepara. Cadastre-se, escolha sua trilha e transforme sua carreira.
          </p>

          <div class="flex flex-wrap gap-4 pt-2">
            <NuxtLink to="/cadastrar" class="btn btn-accent text-base px-8 py-4 rounded-xl">
              Cadastre-se gratuitamente
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </NuxtLink>
            <NuxtLink to="/cursos" class="btn btn-ghost text-base px-8 py-4 rounded-xl">
              Ver cursos
            </NuxtLink>
          </div>

          <div class="flex flex-wrap gap-6 pt-4 text-sm text-white/70">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              100% gratuito
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              Presencial, Online e EAD
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Parceiros oficiais
            </div>
          </div>
        </div>

        <!-- Floating stats cards -->
        <div class="hidden lg:grid grid-cols-2 gap-4">
          <div class="glass-dark rounded-2xl p-6 text-white animate-float" style="animation-delay: 0s">
            <p class="text-4xl font-bold text-accent">{{ stats.courses }}+</p>
            <p class="text-sm text-white/70 mt-1">Cursos disponíveis</p>
          </div>
          <div class="glass-dark rounded-2xl p-6 text-white animate-float-delayed mt-8">
            <p class="text-4xl font-bold text-h4">4</p>
            <p class="text-sm text-white/70 mt-1">Trilhas de formação</p>
          </div>
          <div class="glass-dark rounded-2xl p-6 text-white col-span-2 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-white/70">Parceiros</p>
                <p class="text-lg font-semibold mt-1">SENAC · SENAI · SIMM</p>
              </div>
              <div class="flex -space-x-2">
                <div class="w-10 h-10 rounded-full bg-primary-light border-2 border-white/20 flex items-center justify-center text-xs font-bold">SN</div>
                <div class="w-10 h-10 rounded-full bg-accent border-2 border-white/20 flex items-center justify-center text-xs font-bold">SI</div>
                <div class="w-10 h-10 rounded-full bg-h4 border-2 border-white/20 flex items-center justify-center text-xs font-bold text-primary">SM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wave divider -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 80" fill="none" class="w-full h-12 lg:h-20" preserveAspectRatio="none">
        <path d="M0 80V40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0Z" fill="#f4f7fb"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ courseCount?: number }>(), { courseCount: 3 })

const stats = computed(() => ({
  courses: props.courseCount,
}))
</script>
