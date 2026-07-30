<template>
  <span
    class="inline-flex items-center whitespace-nowrap shrink-0 text-xs font-medium px-2 py-1 rounded-full"
    :class="badgeClass"
  >{{ label }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>()

const labels: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Recusado',
}

const classes: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const label = computed(() => labels[props.status] || props.status)
const badgeClass = computed(() => classes[props.status] || 'bg-gray-100 text-gray-600')
</script>
