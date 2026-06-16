<template>
  <section class="rounded-2xl border border-gray-100 bg-white p-6 lg:p-8 shadow-card">
    <div class="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
      <div
        class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-soft"
        :class="iconBg"
      >
        <slot name="icon">
          <span class="text-lg">{{ emoji }}</span>
        </slot>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-[#2d3f58]">{{ title }}</h2>
        <p v-if="description" class="text-sm text-muted mt-1">{{ description }}</p>
      </div>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    emoji?: string
    iconBg?: string
  }>(),
  {
    emoji: '📋',
    iconBg: 'bg-gradient-to-br from-primary to-primary-light',
  },
)
</script>
