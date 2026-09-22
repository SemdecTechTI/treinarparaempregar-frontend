<template>
  <div class="flex gap-2 flex-wrap">
    <button
      v-if="showXlsx"
      type="button"
      class="btn text-sm py-2 bg-green-600 hover:bg-green-700"
      :disabled="exporting"
      @click="exportFile('xlsx')"
    >
      {{ exporting ? 'Exportando...' : xlsxLabel }}
    </button>
    <button
      v-if="showCsv"
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
    formats?: Array<'xlsx' | 'csv'>
    xlsxLabel?: string
  }>(),
  {
    filters: () => ({}),
    endpoint: '/admin/enrollments/export',
    filename: 'inscricoes',
    formats: () => ['xlsx', 'csv'],
    xlsxLabel: 'Exportar XLSX',
  },
)

const showXlsx = computed(() => props.formats.includes('xlsx'))
const showCsv = computed(() => props.formats.includes('csv'))

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
    await dialog.toastError(e?.message || 'Não foi possível exportar. Tente novamente.')
  } finally {
    exporting.value = false
  }
}
</script>
