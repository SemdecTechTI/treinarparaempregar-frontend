<template>
  <section class="prefeitura-bar" aria-label="Barra institucional da Prefeitura de Salvador">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-11 lg:h-12 gap-4">
        <a
          href="https://www.salvador.ba.gov.br"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 flex items-center py-1 hover:opacity-90 transition-opacity"
          title="Prefeitura de Salvador"
        >
          <img
            :src="RODPAE_LOGO"
            alt="Prefeitura de Salvador — RODPAE"
            class="h-7 lg:h-8 w-auto"
            width="200"
            height="36"
          />
        </a>

        <div class="flex items-center gap-1 sm:gap-2">
          <PrefeituraSocialIcon
            v-for="social in PREFEITURA_SOCIAL"
            :key="social.name"
            :name="social.name"
            :href="social.href"
            :icon="social.icon"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PREFEITURA_SOCIAL, RODPAE_LOGO } from '~/utils/prefeitura'
</script>

<style scoped>
.prefeitura-bar {
  background-color: #00519a;
  @apply text-white relative z-[60];
}
</style>
