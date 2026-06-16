<template>
  <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between gap-4 mb-6 rounded-lg">
    <h1 class="text-lg font-semibold text-primary">{{ title }}</h1>
    <div class="flex items-center gap-3">
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
