<template>
  <span
    class="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 px-3 py-1 rounded-full text-xs font-semibold"
    :class="badgeClass"
  >
    <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'disponivel' | 'esgotado' | 'encerrada'
}>()

const label = computed(() => {
  switch (props.status) {
    case 'disponivel':
      return 'Inscrições abertas'
    case 'esgotado':
      return 'Vagas esgotadas'
    case 'encerrada':
      return 'Inscrições encerradas'
    default:
      return ''
  }
})

const badgeClass = computed(() => {
  switch (props.status) {
    case 'disponivel':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'esgotado':
      return 'bg-amber-50 text-amber-800 border border-amber-200'
    case 'encerrada':
      return 'bg-gray-100 text-muted border border-gray-200'
    default:
      return 'bg-gray-100 text-muted'
  }
})
</script>
