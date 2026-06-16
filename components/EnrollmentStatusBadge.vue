<template>
  <span
    class="inline-flex items-center whitespace-nowrap shrink-0 text-xs font-medium px-2 py-1 rounded-full"
    :class="badgeClass"
  >{{ label }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>()

const labels: Record<string, string> = {
  pendente: 'Pendente',
  em_analise: 'Em análise',
  repassado_parceiro: 'Repassado ao parceiro',
  confirmado_parceiro: 'Confirmado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  recusado: 'Recusado',
  cancelado: 'Cancelado',
  desistente: 'Desistente',
}

const classes: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  em_analise: 'bg-blue-100 text-blue-800',
  repassado_parceiro: 'bg-indigo-100 text-indigo-800',
  confirmado_parceiro: 'bg-green-100 text-green-800',
  em_andamento: 'bg-cyan-100 text-cyan-800',
  concluido: 'bg-green-100 text-green-800',
  recusado: 'bg-red-100 text-red-800',
  cancelado: 'bg-gray-100 text-gray-600',
  desistente: 'bg-gray-100 text-gray-600',
}

const label = computed(() => labels[props.status] || props.status)
const badgeClass = computed(() => classes[props.status] || 'bg-gray-100 text-gray-600')
</script>
