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
import { SOCIAL_FACEBOOK_URL, SOCIAL_INSTAGRAM_URL } from '~/utils/branding'
import { PREFEITURA_FOOTER_TEXT, PREFEITURA_SOCIAL } from '~/utils/prefeitura'
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from '~/utils/site'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')
const logo = absoluteUrl(DEFAULT_OG_IMAGE, siteUrl)
const sameAs = [
  SOCIAL_FACEBOOK_URL,
  SOCIAL_INSTAGRAM_URL,
  PREFEITURA_FOOTER_TEXT.siteUrl,
  ...PREFEITURA_SOCIAL.map(s => s.href),
]

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Treinar para Empregar',
        url: siteUrl,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'pt-BR',
        publisher: { '@type': 'GovernmentOrganization', name: 'SEMDEC — Prefeitura de Salvador' },
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        name: 'Treinar para Empregar — SEMDEC Salvador',
        url: siteUrl,
        logo,
        telephone: PREFEITURA_FOOTER_TEXT.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: PREFEITURA_FOOTER_TEXT.address,
          addressLocality: 'Salvador',
          addressRegion: 'BA',
          addressCountry: 'BR',
        },
        sameAs,
      }),
    },
  ],
})
</script>
