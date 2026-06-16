<template>
  <div>
    <AdminHeader title="Dashboard" />
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-muted">Total inscrições</p>
        <p class="text-3xl font-bold text-primary">{{ data?.totals?.total || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-muted">Pendentes</p>
        <p class="text-3xl font-bold text-yellow-600">{{ data?.totals?.pendentes || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-muted">Esta semana</p>
        <p class="text-3xl font-bold text-accent">{{ data?.totals?.semana || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-muted">Este mês</p>
        <p class="text-3xl font-bold text-primary">{{ data?.totals?.mes || 0 }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="font-semibold text-primary mb-4">Inscrições por curso</h2>
        <div class="space-y-2">
          <div v-for="item in data?.por_curso" :key="item.titulo" class="flex items-center gap-3">
            <div class="flex-1 text-sm truncate">{{ item.titulo }}</div>
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" :style="{ width: `${(item.total / maxCurso) * 100}%` }" />
            </div>
            <span class="text-sm font-medium w-8">{{ item.total }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="font-semibold text-primary mb-4">Últimas inscrições</h2>
        <div class="space-y-3">
          <NuxtLink
            v-for="item in data?.recentes"
            :key="item.id"
            :to="`/admin/inscricoes/${item.id}`"
            class="flex justify-between items-center py-2 border-b last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded"
          >
            <span class="text-sm">{{ item.cidadao }}</span>
            <EnrollmentStatusBadge :status="item.status" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const data = ref<any>(null)
const maxCurso = computed(() => Math.max(...(data.value?.por_curso?.map((c: any) => c.total) || [1]), 1))

onMounted(async () => {
  data.value = await useApi('/admin/dashboard')
})
</script>
