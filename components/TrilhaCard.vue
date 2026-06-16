<template>
  <NuxtLink
    :to="to"
    class="group card-modern p-6 flex flex-col gap-3 relative overflow-hidden"
  >
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      :class="gradientClass"
    />
    <div class="relative z-10">
      <span class="mb-2 flex items-center justify-center size-16 text-[64px] leading-none transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{{ icon }}</span>
      <h3 class="font-semibold text-primary text-lg group-hover:text-white transition-colors duration-300">{{ title }}</h3>
      <p class="text-sm text-muted mt-1 group-hover:text-white/80 transition-colors duration-300">{{ description }}</p>
      <span class="inline-flex items-center gap-1 text-sm font-medium text-accent mt-3 group-hover:text-white transition-all duration-300 group-hover:gap-2">
        Explorar
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  title: string
  description: string
  icon: string
  gradientClass: string
}>()
</script>
