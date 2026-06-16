<template>
  <div>
    <div class="flex justify-between text-xs font-medium text-muted mb-2">
      <span>Progresso</span>
      <span class="text-accent">{{ Math.round(percent) }}%</span>
    </div>
    <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-primary to-accent relative"
        :style="{ width: `${percent}%` }"
      >
        <div class="absolute inset-0 bg-white/20 animate-shimmer" style="background-size: 200% 100%;" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ percent: number }>()
</script>
