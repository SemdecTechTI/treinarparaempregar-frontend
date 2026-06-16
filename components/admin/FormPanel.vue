<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6 w-full max-w-3xl mx-auto space-y-4">
    <h2 v-if="title" class="font-semibold text-primary text-base">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
