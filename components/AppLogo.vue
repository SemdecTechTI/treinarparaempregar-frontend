<template>
  <NuxtLink :to="to" :class="['flex items-center shrink-0 group', linkClass]">
    <img
      :src="LOGO_TREINAR_BRANCA"
      alt="Treinar para Empregar — Salvador"
      :class="[
        'h-9 sm:h-10 lg:h-11 w-auto max-w-[200px] sm:max-w-[240px] transition-all duration-300 group-hover:opacity-90 group-hover:scale-[1.02]',
        variant === 'light' ? 'logo-treinar-on-light' : '',
      ]"
      width="240"
      height="48"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import { LOGO_TREINAR_BRANCA } from '~/utils/branding'

withDefaults(
  defineProps<{
    /** white = logo branca em fundo escuro; light = adaptada para header claro */
    variant?: 'white' | 'light'
    linkClass?: string
    to?: string
  }>(),
  { variant: 'white', linkClass: '', to: '/' },
)
</script>

<style scoped>
/* Aproxima as cores institucionais (azul + detalhe) em fundos claros */
.logo-treinar-on-light {
  filter: brightness(0) saturate(100%) invert(24%) sepia(42%) saturate(1200%) hue-rotate(196deg) brightness(0.85);
}
</style>
