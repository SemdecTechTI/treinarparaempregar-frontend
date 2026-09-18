<template>
  <div v-if="meta.last_page > 1" class="flex items-center justify-between px-4 py-3 border-t text-sm">
    <p class="text-muted">{{ meta.total }} registro(s)</p>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="btn btn-outline text-sm py-1.5 px-3 disabled:opacity-40"
        :disabled="meta.current_page <= 1 || disabled"
        @click="$emit('change', meta.current_page - 1)"
      >
        Anterior
      </button>
      <span class="px-2 py-1 text-muted whitespace-nowrap">{{ meta.current_page }} / {{ meta.last_page }}</span>
      <button
        type="button"
        class="btn btn-outline text-sm py-1.5 px-3 disabled:opacity-40"
        :disabled="meta.current_page >= meta.last_page || disabled"
        @click="$emit('change', meta.current_page + 1)"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  meta: { current_page: number; last_page: number; total: number }
  disabled?: boolean
}>()
defineEmits<{ change: [page: number] }>()
</script>
