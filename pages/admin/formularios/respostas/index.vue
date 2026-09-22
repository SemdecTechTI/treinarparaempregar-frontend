<template>
  <div>
    <AdminHeader title="Respostas recebidas" />
    <div class="flex gap-3 mb-4">
      <input v-model="search" type="search" placeholder="Buscar..." class="input-modern flex-1" @keyup.enter="load(1)" />
      <button type="button" class="btn text-sm py-2" @click="load(1)">Buscar</button>
    </div>
    <PageLoading v-if="loading" variant="table" />
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Formulário</th>
            <th class="px-4 py-3 text-left whitespace-nowrap">Cadastro</th>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">E-mail</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!entries.length" class="border-t">
            <td colspan="5" class="px-4 py-6 text-center text-muted">Nenhuma resposta encontrada.</td>
          </tr>
          <tr v-for="e in entries" :key="e.id" class="border-t">
            <td class="px-4 py-3">{{ e.form?.title || '—' }}</td>
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

const entries = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })

async function load(page = 1) {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: String(page) })
    if (search.value.trim()) params.set('search', search.value.trim())
    const data = await useApi<any>(`/admin/form-entries?${params}`)
    entries.value = data.data || []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? entries.value.length
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>
