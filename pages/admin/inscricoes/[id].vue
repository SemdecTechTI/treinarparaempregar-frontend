<template>
  <div>
    <AdminHeader title="Detalhe da inscrição" />
    <div v-if="loading" class="text-center py-12">Carregando...</div>
    <div v-else-if="enrollment" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 class="font-semibold text-primary">Dados do cidadão</h2>
        <dl class="grid grid-cols-2 gap-3 text-sm">
          <div><dt class="text-muted">Nome</dt><dd>{{ enrollment.user?.name }}</dd></div>
          <div><dt class="text-muted">CPF</dt><dd>{{ enrollment.user?.cpf }}</dd></div>
          <div><dt class="text-muted">Email</dt><dd>{{ enrollment.user?.email }}</dd></div>
          <div><dt class="text-muted">Telefone</dt><dd>{{ enrollment.user?.phone }}</dd></div>
          <div><dt class="text-muted">Nascimento</dt><dd>{{ enrollment.user?.birth_date }}</dd></div>
          <div><dt class="text-muted">Gênero</dt><dd>{{ enrollment.user?.gender }}</dd></div>
          <div><dt class="text-muted">Raça</dt><dd>{{ enrollment.user?.race }}</dd></div>
          <div><dt class="text-muted">Escolaridade</dt><dd>{{ enrollment.user?.education }}</dd></div>
          <div class="col-span-2"><dt class="text-muted">Endereço</dt><dd>{{ fullAddress }}</dd></div>
        </dl>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="font-semibold text-primary mb-4">Status</h2>
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <EnrollmentStatusBadge :status="enrollment.status" />
            <span
              v-if="enrollment.on_waiting_list"
              class="inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300"
            >
              ⚠️ Lista de reserva
            </span>
            <span
              v-if="enrollment.partner_status"
              class="inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold"
              :class="enrollment.partner_status === 'concluido'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'"
              title="Status do cidadão junto ao parceiro"
            >
              Parceiro: {{ enrollment.partner_status === 'concluido' ? 'Concluído' : 'Evadido' }}
            </span>
          </div>
          <div class="space-y-2">
            <select v-model="newStatus" class="w-full border rounded px-3 py-2 text-sm">
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em análise</option>
              <option value="repassado_parceiro">Repassado ao parceiro</option>
              <option value="confirmado_parceiro">Confirmado parceiro</option>
              <option value="concluido">Concluído</option>
              <option value="recusado">Recusado</option>
              <option value="cancelado">Cancelado</option>
              <option value="desistente">Desistente</option>
            </select>
            <textarea v-model="note" rows="3" placeholder="Observação..." class="w-full border rounded px-3 py-2 text-sm" />
            <div class="flex flex-wrap gap-3 pt-1">
              <button class="btn text-sm py-2" @click="updateStatus" :disabled="saving">{{ saving ? 'Salvando...' : 'Salvar status' }}</button>
              <AdminActionButton to="/admin/inscricoes" label="Voltar" variant="outline" size="md" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="font-semibold text-primary mb-4">Histórico</h2>
          <div class="space-y-3 text-sm">
            <div v-for="h in enrollment.status_history" :key="h.id" class="border-b pb-2">
              <p><EnrollmentStatusBadge :status="h.to_status" /></p>
              <p class="text-xs text-muted">{{ formatDate(h.created_at) }} — {{ h.changed_by_user?.name }}</p>
              <p v-if="h.note" class="text-xs mt-1">{{ h.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'enrollments' })

const route = useRoute()
const id = route.params.id as string
const enrollment = ref<any>(null)
const loading = ref(true)
const newStatus = ref('')
const note = ref('')
const saving = ref(false)

const fullAddress = computed(() => {
  const u = enrollment.value?.user
  if (!u) return ''
  return `${u.address || ''}, ${u.number || 's/n'} - ${u.neighborhood}, ${u.city}/${u.state}`
})

function formatDate(d: string) {
  return new Date(d).toLocaleString('pt-BR')
}

async function load() {
  enrollment.value = await useApi(`/admin/enrollments/${id}`)
  newStatus.value = enrollment.value.status
}

async function updateStatus() {
  saving.value = true
  try {
    await useApi(`/admin/enrollments/${id}/status`, {
      method: 'PUT',
      body: { status: newStatus.value, note: note.value },
    })
    await load()
    note.value = ''
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await load()
  loading.value = false
})
</script>
