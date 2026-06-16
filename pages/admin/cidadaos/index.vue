<template>
  <div>
    <AdminHeader title="Cidadãos" />

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="search"
        type="search"
        placeholder="Buscar nome, email, CPF ou telefone..."
        class="input-modern flex-1 min-w-[220px]"
        @keyup.enter="load(1)"
      />
      <button type="button" class="btn text-sm py-2" @click="load(1)">Buscar</button>
    </div>

    <div v-if="loading" class="text-muted text-sm">Carregando...</div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">CPF</th>
            <th class="px-4 py-3 text-left">Telefone</th>
            <th class="px-4 py-3 text-left">Cidade</th>
            <th class="px-4 py-3 text-left">Inscrições</th>
            <th class="px-4 py-3 text-left">Cadastro</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!citizens.length" class="border-t">
            <td colspan="8" class="px-4 py-6 text-center text-muted">Nenhum cidadão encontrado.</td>
          </tr>
          <tr v-for="c in citizens" :key="c.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ c.name }}</td>
            <td class="px-4 py-3">{{ c.email }}</td>
            <td class="px-4 py-3">{{ c.cpf || c.profile?.cpf || '—' }}</td>
            <td class="px-4 py-3">{{ c.phone || c.profile?.phone || '—' }}</td>
            <td class="px-4 py-3">{{ c.city || c.profile?.city || '—' }}</td>
            <td class="px-4 py-3">{{ c.enrollments_count ?? 0 }}</td>
            <td class="px-4 py-3">{{ formatDate(c.created_at) }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Ver perfil', to: `/admin/cidadaos/${c.id}` },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-4 py-3 border-t text-sm">
        <p class="text-muted">{{ meta.total }} cidadão(s)</p>
        <div class="flex gap-2">
          <AdminActionButton
            label="Anterior"
            variant="outline"
            :disabled="meta.current_page <= 1"
            @click="load(meta.current_page - 1)"
          />
          <span class="px-2 py-1 text-muted">{{ meta.current_page }} / {{ meta.last_page }}</span>
          <AdminActionButton
            label="Próxima"
            variant="outline"
            :disabled="meta.current_page >= meta.last_page"
            @click="load(meta.current_page + 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const citizens = ref<any[]>([])
const loading = ref(true)
const loadError = ref('')
const search = ref('')
const meta = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR')
}

async function load(page = 1) {
  loading.value = true
  loadError.value = ''
  try {
    const params = new URLSearchParams({ page: String(page) })
    if (search.value.trim()) params.set('search', search.value.trim())
    const data = await useApi<any>(`/admin/citizens?${params}`)
    citizens.value = data.data || []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? citizens.value.length
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar cidadãos.'
    citizens.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>
