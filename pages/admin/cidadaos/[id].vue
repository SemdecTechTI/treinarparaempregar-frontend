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
            <dt class="text-muted">Nome social</dt>
            <dd>{{ p('social_name') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Email</dt>
            <dd>{{ citizen.email }}</dd>
          </div>
          <div>
            <dt class="text-muted">Telefone</dt>
            <dd>{{ p('phone') }}</dd>
          </div>
          <div>
            <dt class="text-muted">CPF</dt>
            <dd>{{ p('cpf') }}</dd>
          </div>
          <div>
            <dt class="text-muted">RG</dt>
            <dd>{{ p('rg') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Emissão do RG</dt>
            <dd>{{ formatDate(p('rg_issue_date')) }} — {{ p('rg_issuer') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Nascimento</dt>
            <dd>{{ formatDate(p('birth_date')) }}</dd>
          </div>
          <div>
            <dt class="text-muted">Naturalidade</dt>
            <dd>{{ p('birthplace') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Sexo</dt>
            <dd>{{ p('gender') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Orientação sexual</dt>
            <dd>{{ p('sexual_orientation') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Identidade de gênero</dt>
            <dd>{{ p('gender_identity') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Raça / cor</dt>
            <dd>{{ p('race') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Escolaridade</dt>
            <dd>{{ p('education') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Nome da mãe</dt>
            <dd>{{ p('mother_name') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Nome do pai</dt>
            <dd>{{ p('father_name') }}</dd>
          </div>
          <div>
            <dt class="text-muted">Deficiência</dt>
            <dd>
              <template v-if="boolVal('has_disability')">
                Sim — {{ (citizen.disability_types || citizen.profile?.disability_types || []).join(', ') || '—' }}
              </template>
              <template v-else>Não</template>
            </dd>
          </div>
          <div>
            <dt class="text-muted">CadÚnico</dt>
            <dd>{{ boolVal('registered_cadunico') ? 'Sim' : 'Não' }}</dd>
          </div>
          <div>
            <dt class="text-muted">Benefício social</dt>
            <dd>
              <template v-if="boolVal('receives_social_benefit')">
                Sim — {{ p('social_benefit_name') }}
              </template>
              <template v-else>Não</template>
            </dd>
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
              <td class="px-4 py-3">
                <p class="font-medium text-primary">{{ e.enrollable?.title || '—' }}</p>
                <p v-if="e.enrollable?.internal_title" class="text-xs text-muted">{{ e.enrollable.internal_title }}</p>
              </td>
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
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'citizens' })

const route = useRoute()
const id = Number(route.params.id)

const citizen = ref<any>(null)
const loading = ref(true)
const error = ref('')

function p(key: string) {
  if (!citizen.value) return '—'
  const value = citizen.value[key] ?? citizen.value.profile?.[key]
  return value === null || value === undefined || value === '' ? '—' : value
}

function boolVal(key: string) {
  if (!citizen.value) return false
  return !!(citizen.value[key] ?? citizen.value.profile?.[key])
}

const fullAddress = computed(() => {
  if (!citizen.value) return '—'
  const src = citizen.value.profile || citizen.value
  const parts = [
    src.address,
    src.number,
    src.neighborhood,
    src.city,
    src.state,
    src.cep,
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})

function formatDate(d: string | null | undefined) {
  if (!d || d === '—') return '—'
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
