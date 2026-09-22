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

    <PageLoading v-if="loading" variant="table" />
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left whitespace-nowrap">Cadastro</th>
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
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDateTime(e.submitted_at) }}</td>
            <td class="px-4 py-3">{{ e.name || '—' }}</td>
            <td class="px-4 py-3">{{ e.email || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <NuxtLink :to="`/admin/formularios/respostas/${e.id}`" class="text-accent text-sm">Ver</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <AdminPagination :meta="meta" :disabled="loading" @change="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '~/utils/datetime'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'forms' })

const route = useRoute()
const formId = Number(route.params.id)

const formTitle = ref('')
const entries = ref<any[]>([])
const loading = ref(true)
const exporting = ref(false)
const dialog = useDialog()
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })

async function load(page = 1) {
  loading.value = true
  try {
    const params = new URLSearchParams({ form_id: String(formId), page: String(page) })
    const data = await useApi<any>(`/admin/form-entries?${params}`)
    entries.value = data.data ?? []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? entries.value.length
  } finally {
    loading.value = false
  }
}

const title = computed(() =>
  formTitle.value ? `Respostas: ${formTitle.value}` : 'Respostas do formulário',
)

async function exportFile(format: 'csv' | 'xlsx') {
  exporting.value = true
  try {
    const date = new Date().toISOString().slice(0, 10)
    await downloadApiBlob(`/admin/forms/${formId}/export-csv`, `formulario-${formId}-respostas-${date}.${format}`, { format })
  } catch (e: any) {
    await dialog.toastError(e?.message || 'Não foi possível exportar.')
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  try {
    const form = await useApi<any>(`/admin/forms/${formId}`)
    formTitle.value = form.title
  } catch {
    // título é opcional
  }
  await load(1)
})
</script>
