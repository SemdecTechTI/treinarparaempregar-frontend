<template>
  <div>
    <AdminHeader :title="title">
      <button
        v-if="formId"
        type="button"
        class="btn text-sm py-2 bg-green-600 hover:bg-green-700"
        :disabled="exporting"
        @click="exportFile('xlsx')"
      >
        {{ exporting ? 'Exportando...' : 'Exportar XLSX' }}
      </button>
      <button
        v-if="formId"
        type="button"
        class="btn btn-outline text-sm py-2"
        :disabled="exporting"
        @click="exportFile('csv')"
      >
        Exportar CSV
      </button>
    </AdminHeader>

    <div v-if="loading" class="text-muted text-sm">Carregando...</div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Data</th>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">E-mail</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!entries.length" class="border-t">
            <td colspan="5" class="px-4 py-8 text-center text-muted">Nenhuma resposta.</td>
          </tr>
          <tr v-for="e in entries" :key="e.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3">{{ e.id }}</td>
            <td class="px-4 py-3">{{ formatDate(e.submitted_at) }}</td>
            <td class="px-4 py-3">{{ e.name || '—' }}</td>
            <td class="px-4 py-3">{{ e.email || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <NuxtLink :to="`/admin/formularios/respostas/${e.id}`" class="text-accent text-sm">Ver</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'forms' })

const route = useRoute()
const formId = Number(route.params.id)

const formTitle = ref('')
const entries = ref<any[]>([])
const loading = ref(true)
const exporting = ref(false)
const dialog = useDialog()

const title = computed(() =>
  formTitle.value ? `Respostas: ${formTitle.value}` : 'Respostas do formulário',
)

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleString('pt-BR')
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
  try {
    const form = await useApi<any>(`/admin/forms/${formId}`)
    formTitle.value = form.title
    const data = await useApi<any>(`/admin/form-entries?form_id=${formId}`)
    entries.value = data.data ?? []
  } finally {
    loading.value = false
  }
})
</script>
