<template>
  <div>
    <section class="relative py-16 lg:py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      <div class="container mx-auto px-4 relative z-10 max-w-3xl">
        <RevealOnScroll>
          <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Institucional</p>
          <h1 class="mb-6">Quem somos</h1>
          <p class="text-lg text-muted leading-relaxed">
            O programa <strong class="text-primary">Treinar para Empregar</strong> é uma iniciativa da Secretaria de Desenvolvimento Econômico, Emprego e Renda (SEMDEC) da Prefeitura de Salvador.
          </p>
        </RevealOnScroll>
      </div>
    </section>

    <section class="container mx-auto px-4 pt-12 lg:pt-16 pb-20 max-w-4xl">
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <RevealOnScroll :delay="0">
          <div class="card-modern p-6 text-center">
            <div class="text-3xl mb-3">🎯</div>
            <h3 class="font-semibold text-primary mb-2">Nosso objetivo</h3>
            <p class="text-sm text-muted">Preparar cidadãos para o mercado de trabalho com cursos gratuitos.</p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll :delay="100">
          <div class="card-modern p-6 text-center">
            <div class="text-3xl mb-3">🤝</div>
            <h3 class="font-semibold text-primary mb-2">Parceiros</h3>
            <p class="text-sm text-muted">SENAC, SENAI e SIMM Prepara em parceria com a Prefeitura.</p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll :delay="200">
          <div class="card-modern p-6 text-center">
            <div class="text-3xl mb-3">📚</div>
            <h3 class="font-semibold text-primary mb-2">4 trilhas</h3>
            <p class="text-sm text-muted">Base, Saúde, Serviços e Construção Civil.</p>
          </div>
        </RevealOnScroll>
      </div>

      <RevealOnScroll>
        <div class="card-modern p-8 prose text-text max-w-none space-y-4">
          <p>Em parceria com instituições como SENAC, SENAI e SIMM Prepara, oferecemos cursos presenciais e online em diversas trilhas de formação profissional.</p>
          <p>Nosso objetivo é preparar os cidadãos para o mercado de trabalho, desenvolvendo competências técnicas e comportamentais essenciais para a empregabilidade.</p>
          <NuxtLink to="/cadastrar" class="btn mt-4 inline-flex">Comece agora — é gratuito</NuxtLink>
        </div>
      </RevealOnScroll>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'Quem somos',
  description: 'Conheça o programa Treinar para Empregar, iniciativa da SEMDEC da Prefeitura de Salvador para qualificação profissional gratuita.',
  path: '/quem-somos',
})
</script>
