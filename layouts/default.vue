<template>
  <div class="min-h-screen flex flex-col">
    <PrefeituraBarTop />
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
    <PrefeituraBarFooter />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Treinar para Empregar',
        url: siteUrl,
        description: 'Plataforma municipal de qualificação profissional da Prefeitura de Salvador.',
        inLanguage: 'pt-BR',
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        name: 'Treinar para Empregar — SEMDEC Salvador',
        url: siteUrl,
      }),
    },
  ],
})
</script>
