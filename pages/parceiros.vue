<template>
  <div>
    <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent text-white">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div class="absolute bottom-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>
      <div class="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Rede</p>
        <h1 class="text-3xl lg:text-5xl font-semibold text-white mb-4 max-w-3xl">Parceiros</h1>
        <p class="text-white/80 text-lg max-w-2xl">
          Instituições que oferecem cursos gratuitos de qualificação profissional em parceria com o Treinar para Empregar.
        </p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12 lg:py-16">
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="skeleton h-64 rounded-2xl" />
      </div>

      <p v-else-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <div v-else-if="!partners.length" class="text-center py-20 card-modern">
        <div class="text-5xl mb-4 opacity-30">🤝</div>
        <p class="text-lg font-medium text-primary">Nenhum parceiro cadastrado</p>
        <p class="text-muted text-sm mt-2">Volte em breve para conhecer as instituições da rede.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevealOnScroll v-for="(p, i) in partners" :key="p.id" class="h-full" :delay="(i % 6) * 60">
          <article class="card-modern p-6 h-full flex flex-col items-center text-center gap-4">
            <component
              :is="websiteHref(p) ? 'a' : 'div'"
              :href="websiteHref(p) || undefined"
              :target="websiteHref(p) ? '_blank' : undefined"
              :rel="websiteHref(p) ? 'noopener noreferrer' : undefined"
              class="flex flex-col items-center gap-4"
              :class="websiteHref(p) ? 'group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent' : ''"
              :title="websiteHref(p) ? `Abrir site de ${p.name}` : undefined"
            >
              <div
                class="w-24 h-24 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden"
                :class="p.logo ? 'bg-white' : partnerAvatarTone(i)"
              >
                <img
                  v-if="p.logo"
                  :src="resolveMediaUrl(p.logo)"
                  :alt="p.name"
                  class="w-full h-full object-contain p-3"
                />
                <span v-else class="text-2xl font-bold">{{ partnerInitials(p.name) }}</span>
              </div>
              <h2 class="font-semibold text-primary text-lg leading-snug group-hover:text-accent transition-colors">
                {{ p.name }}
              </h2>
              <span
                v-if="websiteHref(p)"
                class="text-sm text-accent font-semibold inline-flex items-center gap-1"
              >
                Visitar site
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </span>
            </component>

            <div v-if="p.contact_email || p.contact_phone" class="w-full space-y-1.5 text-sm text-muted">
              <a
                v-if="p.contact_email"
                :href="`mailto:${p.contact_email}`"
                class="block hover:text-primary break-all"
              >
                {{ p.contact_email }}
              </a>
              <a
                v-if="p.contact_phone"
                :href="`tel:${telHref(p.contact_phone)}`"
                class="block hover:text-primary"
              >
                {{ p.contact_phone }}
              </a>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveMediaUrl } from '~/utils/media'
import { partnerAvatarTone, partnerInitials, partnerWebsiteHref, type PublicPartner } from '~/utils/partners'

function websiteHref(p: PublicPartner) {
  return partnerWebsiteHref(p.website_url)
}

function telHref(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

usePageSeo({
  title: 'Parceiros',
  description: 'Conheça as instituições parceiras do Treinar para Empregar em Salvador: cursos gratuitos de qualificação profissional.',
  path: '/parceiros',
})

const { data: partnersData, pending: loading } = await useAsyncData('public-partners', async () => {
  try {
    const list = await useApiPublic<PublicPartner[]>('/partners')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
})

const partners = computed(() => partnersData.value ?? [])
const error = computed(() => '')
</script>
