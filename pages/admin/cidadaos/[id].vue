<template>
  <div>
    <AdminHeader :title="citizen?.name || 'Cidadão'" />

    <div v-if="loading" class="text-muted text-sm">Carregando...</div>
    <p v-else-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <div v-else-if="citizen" class="space-y-6 max-w-4xl mx-auto w-full">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="font-semibold text-primary mb-4">Dados cadastrais</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt class="text-muted">Nome</dt>
            <dd class="font-medium">{{ citizen.name }}</dd>
          </div>
          <div>
            <dt class="text-muted">Email</dt>
            <dd>{{ citizen.email }}</dd>
          </div>
          <div>
            <dt class="text-muted">CPF</dt>
            <dd>{{ citizen.cpf || citizen.profile?.cpf || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Telefone</dt>
            <dd>{{ citizen.phone || citizen.profile?.phone || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Nascimento</dt>
            <dd>{{ formatDate(citizen.birth_date || citizen.profile?.birth_date) }}</dd>
          </div>
          <div>
            <dt class="text-muted">Gênero</dt>
            <dd>{{ citizen.gender || citizen.profile?.gender || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Escolaridade</dt>
            <dd>{{ citizen.education || citizen.profile?.education || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Cadastro na plataforma</dt>
            <dd>{{ formatDate(citizen.created_at) }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-muted">Endereço</dt>
            <dd>{{ fullAddress }}</dd>
          </div>
        </dl>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b">
          <h2 class="font-semibold text-primary">Inscrições em cursos</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">Curso</th>
              <th class="px-4 py-3 text-left">Data</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!citizen.enrollments?.length" class="border-t">
              <td colspan="4" class="px-4 py-6 text-center text-muted">Nenhuma inscrição.</td>
            </tr>
            <tr v-for="e in citizen.enrollments" :key="e.id" class="border-t">
              <td class="px-4 py-3">{{ e.enrollable?.titulo || '—' }}</td>
              <td class="px-4 py-3">{{ formatDate(e.created_at) }}</td>
              <td class="px-4 py-3">
                <EnrollmentStatusBadge :status="e.status" />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end">
                  <AdminRowActionsMenu :items="[
                    { label: 'Ver inscrição', to: `/admin/inscricoes/${e.id}` },
                  ]" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap gap-3">
        <AdminActionButton to="/admin/cidadaos" label="Voltar" variant="outline" size="md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const citizen = ref<any>(null)
const loading = ref(true)
const error = ref('')

const fullAddress = computed(() => {
  if (!citizen.value) return '—'
  const p = citizen.value.profile || citizen.value
  const parts = [
    p.address,
    p.number,
    p.neighborhood,
    p.city,
    p.state,
    p.cep,
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('pt-BR')
}

onMounted(async () => {
  try {
    citizen.value = await useApi(`/admin/citizens/${id}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar cidadão.'
  } finally {
    loading.value = false
  }
})
</script>
