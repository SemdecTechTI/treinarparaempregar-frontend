<template>
  <div>
    <AdminHeader :title="pageTitle">
      <AdminExportButton
        v-if="enrollment"
        :filters="{ enrollment_id: enrollment.id }"
        :filename="singleExportFilename"
        :formats="['xlsx']"
        xlsx-label="Exportar Excel"
      />
      <AdminActionButton
        v-if="enrollment?.user?.id"
        :to="`/admin/cidadaos/${enrollment.user.id}`"
        label="Ver perfil completo"
        variant="outline"
        size="md"
      />
    </AdminHeader>
    <PageLoading v-if="loading" variant="detail" />
    <div v-else-if="enrollment" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6 space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="font-semibold text-primary">Dados do cidadão</h2>
              <p v-if="enrollment.enrollable?.title" class="text-xs text-muted mt-1">
                Curso: {{ enrollment.enrollable.title }}
              </p>
            </div>
            <NuxtLink
              v-if="enrollment.user?.id"
              :to="`/admin/cidadaos/${enrollment.user.id}`"
              class="text-sm font-medium text-accent hover:underline"
            >
              Ver perfil completo
            </NuxtLink>
          </div>
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <div><dt class="text-muted">Nome</dt><dd>{{ display(enrollment.user?.name) }}</dd></div>
            <div><dt class="text-muted">CPF</dt><dd>{{ display(enrollment.user?.cpf) }}</dd></div>
            <div><dt class="text-muted">Email</dt><dd>{{ display(enrollment.user?.email) }}</dd></div>
            <div><dt class="text-muted">Telefone</dt><dd>{{ display(enrollment.user?.phone) }}</dd></div>
            <div><dt class="text-muted">Telefone de emergência</dt><dd>{{ display(enrollment.user?.emergency_phone) }}</dd></div>
            <div><dt class="text-muted">Nascimento</dt><dd>{{ formatDate(enrollment.user?.birth_date) }}</dd></div>
            <div><dt class="text-muted">Gênero</dt><dd>{{ display(enrollment.user?.gender) }}</dd></div>
            <div><dt class="text-muted">Raça</dt><dd>{{ display(enrollment.user?.race) }}</dd></div>
            <div><dt class="text-muted">Escolaridade</dt><dd>{{ display(enrollment.user?.education) }}</dd></div>
            <div><dt class="text-muted">Prefeitura-bairro</dt><dd>{{ display(enrollment.user?.prefeitura_bairro) }}</dd></div>
            <div class="col-span-2"><dt class="text-muted">Endereço</dt><dd>{{ fullAddress }}</dd></div>
          </dl>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="font-semibold text-primary mb-4">Documentos da inscrição</h2>
          <ul v-if="documents.length" class="space-y-3 text-sm">
            <li
              v-for="doc in documents"
              :key="doc.id"
              class="flex flex-wrap items-center justify-between gap-2 border border-gray-100 rounded-lg px-3 py-2"
            >
              <div class="min-w-0">
                <p class="font-medium text-primary">{{ doc.label || doc.document_key }}</p>
                <p class="text-xs text-muted truncate">{{ doc.original_name || 'Arquivo enviado' }}</p>
              </div>
              <a
                :href="documentUrl(doc)"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent text-sm font-medium hover:underline shrink-0"
              >
                Abrir
              </a>
            </li>
          </ul>
          <p v-else class="text-sm text-muted">Nenhum documento enviado nesta inscrição.</p>
        </div>

        <div v-if="customFields.length" class="bg-white rounded-lg shadow p-6">
          <h2 class="font-semibold text-primary mb-4">Campos adicionais</h2>
          <dl class="space-y-3 text-sm">
            <div v-for="field in customFields" :key="field.id">
              <dt class="text-muted">{{ field.custom_field?.label || 'Campo' }}</dt>
              <dd>
                <a
                  v-if="isFileField(field)"
                  :href="customFieldFileUrl(field)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-accent font-medium hover:underline"
                >
                  {{ fileLabel(field) }}
                </a>
                <span v-else>{{ display(field.value) }}</span>
              </dd>
            </div>
          </dl>
        </div>
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
              Lista de reserva
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
          <h2 class="font-semibold text-primary mb-1">Histórico</h2>
          <p class="text-xs text-muted mb-4">Mudanças de status desta inscrição.</p>
          <p v-if="!statusHistory.length" class="text-sm text-muted">Nenhum registro no histórico desta inscrição.</p>
          <div v-else class="space-y-3 text-sm">
            <div v-for="h in statusHistory" :key="h.id" class="border-b last:border-b-0 pb-2 last:pb-0">
              <div class="flex flex-wrap items-center gap-2">
                <EnrollmentStatusBadge v-if="h.from_status" :status="h.from_status" />
                <span v-if="h.from_status" class="text-muted text-xs">para</span>
                <EnrollmentStatusBadge :status="h.to_status" />
              </div>
              <p class="text-xs text-muted mt-1">{{ formatDateTime(h.created_at) }}. {{ h.changed_by_user?.name || 'Sistema' }}</p>
              <p v-if="h.note" class="text-xs mt-1">{{ h.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatDateTime } from '~/utils/datetime'
import { resolveMediaUrl } from '~/utils/media'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'enrollments' })

const route = useRoute()
const id = route.params.id as string
const config = useRuntimeConfig()
const enrollment = ref<any>(null)
const loading = ref(true)
const newStatus = ref('')
const note = ref('')
const saving = ref(false)
const dialog = useDialog()

const pageTitle = computed(() => {
  const title = enrollment.value?.enrollable?.title
  return title ? `Inscrição: ${title}` : 'Detalhe da inscrição'
})

const singleExportFilename = computed(() => {
  const name = String(enrollment.value?.user?.name || 'inscricao')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
    .slice(0, 40)
  return `inscricao_${enrollment.value?.id || id}_${name || 'cidadao'}`
})

const documents = computed(() => enrollment.value?.documents || [])
const customFields = computed(() => enrollment.value?.custom_field_values || [])
const statusHistory = computed(() => enrollment.value?.status_history || [])

const fullAddress = computed(() => {
  const u = enrollment.value?.user
  if (!u) return '—'
  const parts = [u.address, u.number || 's/n', u.neighborhood, u.city, u.state].filter(Boolean)
  return parts.length ? parts.join(', ') : '—'
})

function display(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function isFileField(field: any) {
  const value = String(field?.value || '')
  return field?.custom_field?.type === 'file'
    || value.includes('enrollment-custom-fields/')
}

function fileLabel(field: { original_name?: string; value?: string }) {
  if (field?.original_name) return field.original_name
  const value = String(field?.value || '')
  if (!value) return 'Abrir arquivo'
  const name = value.split('/').pop()
  return name || 'Abrir arquivo'
}

function apiPath(path: string) {
  const base = String(config.public.apiBase || '/api').replace(/\/$/, '')
  return `${base}${path}`
}

function documentUrl(doc: { id: number; path?: string; url?: string }) {
  if (doc.url) return doc.url
  if (doc.path && String(doc.path).includes('uploads/')) return resolveMediaUrl(doc.path)
  return apiPath(`/admin/enrollments/${id}/documents/${doc.id}`)
}

function customFieldFileUrl(field: { id: number; value?: string }) {
  const value = String(field?.value || '')
  if (value.includes('uploads/')) return resolveMediaUrl(value)
  return apiPath(`/admin/enrollments/${id}/custom-field-files/${field.id}`)
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
    await dialog.toastSuccess('Status atualizado.')
  } catch (e: any) {
    await dialog.toastError(e?.data?.message || 'Erro ao atualizar status.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await load()
  loading.value = false
})
</script>
