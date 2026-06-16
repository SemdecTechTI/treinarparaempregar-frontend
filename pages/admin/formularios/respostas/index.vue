<template>
  <div>
    <AdminHeader title="Respostas recebidas" />
    <div class="flex gap-3 mb-4">
      <input v-model="search" type="search" placeholder="Buscar..." class="input-modern flex-1" @keyup.enter="load" />
      <button type="button" class="btn text-sm py-2" @click="load">Buscar</button>
    </div>
    <div v-if="loading" class="text-muted">Carregando...</div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Formulário</th>
            <th class="px-4 py-3 text-left">Data</th>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">E-mail</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in entries" :key="e.id" class="border-t">
            <td class="px-4 py-3">{{ e.form?.title || '—' }}</td>
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
definePageMeta({ layout: 'admin', middleware: 'admin' })

const entries = ref<any[]>([])
const loading = ref(true)
const search = ref('')

function formatDate(d: string) {
  return d ? new Date(d).toLocaleString('pt-BR') : '—'
}

async function load() {
  loading.value = true
  try {
    const q = search.value.trim() ? `?search=${encodeURIComponent(search.value.trim())}` : ''
    const data = await useApi<any>(`/admin/form-entries${q}`)
    entries.value = data.data || []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
