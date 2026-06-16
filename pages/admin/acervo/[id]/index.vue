<template>
  <div>
    <AdminHeader :title="acervo?.titulo || 'Editar acervo'" />
    <div v-if="loading" class="text-muted">Carregando...</div>
    <p v-else-if="error && !acervo" class="text-red-600 text-sm">{{ error }}</p>

    <div v-else-if="acervo" class="w-full max-w-4xl mx-auto space-y-6">
      <form @submit.prevent="save" class="bg-white rounded-lg shadow p-6 space-y-4">
        <AdminAcervoForm :form="form" />
        <div class="flex flex-wrap gap-3 pt-2">
          <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar'" variant="primary" size="md" :disabled="saving" submit />
          <AdminActionButton to="/admin/acervo" label="Voltar" variant="outline" size="md" />
          <AdminActionButton label="Remover acervo" variant="danger" size="md" :disabled="saving" @click="remove" />
        </div>
        <p v-if="message" class="text-sm text-accent">{{ message }}</p>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </form>

      <div class="bg-white rounded-lg shadow p-6">
        <AdminAcervoVideosPanel :acervo-id="id" @refreshed="loadEnrollments" />
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="font-semibold text-primary">Inscrições e progresso</h2>
          <p class="text-sm text-muted mt-1">Cidadãos inscritos neste acervo e quantos vídeos já concluíram.</p>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">Cidadão</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Progresso</th>
              <th class="px-4 py-3 text-left">Vídeos</th>
              <th class="px-4 py-3 text-left">Inscrição</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!enrollments.length" class="border-t">
              <td colspan="5" class="px-4 py-6 text-center text-muted">Nenhuma inscrição ainda.</td>
            </tr>
            <tr v-for="row in enrollments" :key="row.id" class="border-t">
              <td class="px-4 py-3">
                <p class="font-medium">{{ row.user?.name }}</p>
                <p class="text-xs text-muted">{{ row.user?.email }}</p>
              </td>
              <td class="px-4 py-3 capitalize">{{ row.status?.replace('_', ' ') }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-primary" :style="{ width: `${row.progress_percent}%` }" />
                  </div>
                  <span class="text-xs text-muted">{{ row.progress_percent }}%</span>
                </div>
              </td>
              <td class="px-4 py-3">{{ row.videos_completed }} / {{ row.videos_total }}</td>
              <td class="px-4 py-3 text-muted">{{ formatDate(row.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const dialog = useDialog()
const id = Number(route.params.id)

const acervo = ref<any>(null)
const enrollments = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')

const form = reactive({
  titulo: '',
  descricao: '',
  capa: '',
  ativo: true,
  ordem: 0,
})

function formatDate(d: string) {
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function load() {
  try {
    acervo.value = await useApi(`/admin/acervos/${id}`)
    form.titulo = acervo.value.titulo
    form.descricao = acervo.value.descricao || ''
    form.capa = acervo.value.capa || ''
    form.ativo = acervo.value.ativo ?? true
    form.ordem = acervo.value.ordem ?? 0
    await loadEnrollments()
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar acervo.'
  } finally {
    loading.value = false
  }
}

async function loadEnrollments() {
  try {
    enrollments.value = await useApi<any[]>(`/admin/acervos/${id}/enrollments`)
  } catch {
    enrollments.value = []
  }
}

async function save() {
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    await useApi(`/admin/acervos/${id}`, {
      method: 'PUT',
      body: { ...form, ordem: Number(form.ordem) || 0 },
    })
    message.value = 'Acervo atualizado.'
    await load()
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!await dialog.confirm(`Remover o acervo "${acervo.value?.titulo}"?`, {
    title: 'Remover acervo',
    confirmText: 'Remover',
    danger: true,
  })) return
  saving.value = true
  try {
    await useApi(`/admin/acervos/${id}`, { method: 'DELETE' })
    await navigateTo('/admin/acervo')
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível remover.'
    saving.value = false
  }
}

onMounted(load)
</script>
