<template>
  <div>
    <AdminHeader title="Newsletter">
      <AdminExportButton
        endpoint="/admin/exports/newsletter-subscribers"
        filename="newsletter"
        :filters="{ search }"
      />
    </AdminHeader>

    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="search"
        type="search"
        placeholder="Buscar e-mail..."
        class="input-modern flex-1 min-w-[220px]"
        @keyup.enter="load(1)"
      />
      <button type="button" class="btn text-sm py-2" @click="load(1)">Buscar</button>
    </div>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left whitespace-nowrap">Cadastrado em</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="n in 6" :key="n" class="border-t">
              <td class="px-4 py-3"><div class="skeleton h-3 w-56" /></td>
              <td class="px-4 py-3"><div class="skeleton h-3 w-28" /></td>
            </tr>
          </template>
          <tr v-else-if="!subscribers.length" class="border-t">
            <td colspan="2" class="px-4 py-6 text-center text-muted">Nenhum cadastro de newsletter ainda.</td>
          </tr>
          <tr v-for="s in subscribers" :key="s.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">
              <a :href="`mailto:${s.email}`" class="hover:text-accent">{{ s.email }}</a>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDate(s.created_at) }}</td>
          </tr>
        </tbody>
      </table>

      <AdminPagination :meta="meta" :disabled="loading" @change="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'newsletter' })

const subscribers = ref<Array<{ id: number; email: string; created_at: string }>>([])
const loading = ref(false)
const loadError = ref('')
const search = ref('')
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function load(page = meta.current_page) {
  loading.value = true
  loadError.value = ''
  try {
    const params = new URLSearchParams({ page: String(page) })
    if (search.value.trim()) params.set('search', search.value.trim())
    const data = await useApi<any>(`/admin/newsletter-subscribers?${params}`)
    subscribers.value = data.data ?? []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? subscribers.value.length
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar a newsletter.'
    subscribers.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>
