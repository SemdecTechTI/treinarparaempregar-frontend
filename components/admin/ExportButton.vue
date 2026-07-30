<template>
  <div class="flex gap-2 flex-wrap">
    <button
      type="button"
      class="btn text-sm py-2 bg-green-600 hover:bg-green-700"
      :disabled="exporting"
      @click="exportFile('xlsx')"
    >
      {{ exporting ? 'Exportando...' : 'Exportar XLSX' }}
    </button>
    <button
      type="button"
      class="btn text-sm py-2 bg-gray-600 hover:bg-gray-700"
      :disabled="exporting"
      @click="exportFile('csv')"
    >
      Exportar CSV
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    filters?: Record<string, string | number | undefined>
    endpoint?: string
    filename?: string
  }>(),
  {
    filters: () => ({}),
    endpoint: '/admin/enrollments/export',
    filename: 'inscricoes',
  },
)

const exporting = ref(false)
const dialog = useDialog()

async function exportFile(format: string) {
  exporting.value = true
  try {
    const ext = format === 'csv' ? 'csv' : 'xlsx'
    const date = new Date().toISOString().slice(0, 10)
    await downloadApiBlob(props.endpoint, `${props.filename}_${date}.${ext}`, {
      format,
      ...props.filters,
    })
  } catch (e: any) {
    await dialog.error(e?.message || 'Não foi possível exportar. Tente novamente.')
  } finally {
    exporting.value = false
  }
}
</script>
