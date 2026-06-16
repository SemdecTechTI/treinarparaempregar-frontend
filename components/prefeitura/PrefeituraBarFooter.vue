<template>
  <section class="prefeitura-bar-footer" aria-label="Informações institucionais da Prefeitura">
    <div class="container mx-auto px-4 py-4 lg:py-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <a
          href="https://www.salvador.ba.gov.br"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center hover:opacity-90 transition-opacity"
          title="Prefeitura de Salvador"
        >
          <img
            :src="RODPAE_LOGO"
            alt="Prefeitura de Salvador — RODPAE"
            class="h-8 lg:h-9 w-auto max-w-[280px]"
            width="280"
            height="50"
          />
        </a>

        <div class="text-xs lg:text-sm text-white/90 leading-relaxed lg:text-right">
          <p>
            <strong>© {{ year }} – {{ info.copyright }}</strong>
            Site:
            <a :href="info.siteUrl" target="_blank" rel="noopener noreferrer" class="prefeitura-link hover:underline">
              {{ info.site }}
            </a>
          </p>
          <p class="mt-1 text-white/75">
            {{ info.address }}
            <span class="hidden sm:inline"> · </span>
            <span class="block sm:inline mt-1 sm:mt-0">Telefone: {{ info.phone }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PREFEITURA_FOOTER_TEXT, RODPAE_LOGO } from '~/utils/prefeitura'

const year = new Date().getFullYear()
const info = PREFEITURA_FOOTER_TEXT
</script>

<style scoped>
.prefeitura-bar-footer {
  background-color: #00519a;
  @apply text-white;
}
.prefeitura-link {
  @apply text-white hover:text-white/90 transition-colors;
}
</style>
