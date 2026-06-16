<template>

  <div>

    <HeroSection :course-count="courseCount" />



    <!-- Trilhas -->

    <section class="container mx-auto px-4 py-16 lg:py-20">

      <RevealOnScroll>

        <div class="text-center mb-10">

          <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Explore</p>

          <h2 class="section-title">Escolha sua trilha</h2>

          <p class="text-muted mt-3 max-w-xl mx-auto">Cada trilha foi pensada para diferentes perfis e objetivos profissionais.</p>

        </div>

      </RevealOnScroll>



      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <RevealOnScroll :delay="0">

          <TrilhaCard to="/trilhas/base" title="SIMM Prepara" description="Base e preparação para o mercado" icon="📚" gradient-class="bg-gradient-to-br from-primary to-primary-light" />

        </RevealOnScroll>

        <RevealOnScroll :delay="100">

          <TrilhaCard to="/trilhas/saude" title="Saúde" description="Carreiras no setor de saúde" icon="🏥" gradient-class="bg-gradient-to-br from-h3 to-accent" />

        </RevealOnScroll>

        <RevealOnScroll :delay="200">

          <TrilhaCard to="/trilhas/servicos" title="Serviços" description="Soft skills e atendimento" icon="💼" gradient-class="bg-gradient-to-br from-accent to-primary" />

        </RevealOnScroll>

        <RevealOnScroll :delay="300">

          <TrilhaCard to="/trilhas/tecnicos" title="Construção Civil" description="Cursos técnicos especializados" icon="🔧" gradient-class="bg-gradient-to-br from-h5 to-h6" />

        </RevealOnScroll>

      </div>

    </section>



    <!-- Cursos (preview) -->

    <section id="cursos" class="container mx-auto px-4">

      <CourseCatalog

        :preview-limit="6"

        show-view-all-link

        embedded

      />

    </section>



    <!-- CTA -->

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

usePageSeo({

  title: 'Cursos gratuitos de qualificação profissional',

  description: 'Cursos presenciais e online gratuitos em Salvador. Inscreva-se no Treinar para Empregar e qualifique-se para o mercado de trabalho.',

  path: '/',

})



const courseCount = ref(0)



onMounted(async () => {

  try {

    const list = await useApiPublic<any[]>('/cursos')

    courseCount.value = list.length

  } catch {

    courseCount.value = 0

  }

})

</script>
