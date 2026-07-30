<template>
  <div>
    <AdminHeader :title="form?.title ? `Gráficos: ${form.title}` : 'Gráficos'">
      <button type="button" class="btn text-sm py-2 bg-green-600 hover:bg-green-700" :disabled="exporting" @click="exportFile('xlsx')">
        {{ exporting ? 'Exportando...' : 'Exportar XLSX' }}
      </button>
      <button type="button" class="btn btn-outline text-sm py-2" :disabled="exporting" @click="exportFile('csv')">
        Exportar CSV
      </button>
    </AdminHeader>

    <div v-if="loading" class="text-muted">Carregando...</div>
    <template v-else>
      <p class="text-sm text-muted mb-6">Total de respostas: <strong>{{ analytics.total_entries }}</strong></p>

      <div v-if="analytics.daily?.length" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="font-semibold text-primary mb-4">Respostas por dia</h2>
        <div class="space-y-2">
          <div v-for="row in analytics.daily" :key="row.d" class="flex items-center gap-3 text-sm">
            <span class="w-24 text-muted">{{ row.d }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: barWidth(row.c) }" />
            </div>
            <span class="w-8 text-right">{{ row.c }}</span>
          </div>
        </div>
      </div>

      <div v-for="chart in analytics.field_charts" :key="chart.id" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="font-semibold text-primary mb-4">{{ chart.label }}</h2>
        <div class="space-y-2">
          <div v-for="(count, label) in chart.data" :key="label" class="flex items-center gap-3 text-sm">
            <span class="flex-1 truncate">{{ label }}</span>
            <div class="w-32 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div class="bg-accent h-full rounded-full" :style="{ width: fieldBarWidth(count, chart.data) }" />
            </div>
            <span class="w-8 text-right">{{ count }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'forms' })

const route = useRoute()
const formId = Number(route.params.id)
const dialog = useDialog()

const form = ref<any>(null)
const analytics = ref<any>({ total_entries: 0, daily: [], field_charts: [] })
const loading = ref(true)
const exporting = ref(false)

const maxDaily = computed(() =>
  Math.max(1, ...analytics.value.daily?.map((r: any) => Number(r.c)) || [1]),
)

function barWidth(c: string | number) {
  return `${(Number(c) / maxDaily.value) * 100}%`
}

function fieldBarWidth(count: number, data: Record<string, number>) {
  const max = Math.max(1, ...Object.values(data))
  return `${(count / max) * 100}%`
}

async function exportFile(format: 'csv' | 'xlsx') {
  exporting.value = true
  try {
    const date = new Date().toISOString().slice(0, 10)
    await downloadApiBlob(`/admin/forms/${formId}/export-csv`, `formulario-${formId}-respostas-${date}.${format}`, { format })
  } catch (e: any) {
    await dialog.error(e?.message || 'Não foi possível exportar.')
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  form.value = await useApi(`/admin/forms/${formId}`)
  analytics.value = await useApi(`/admin/forms/${formId}/analytics`)
  loading.value = false
})
</script>
