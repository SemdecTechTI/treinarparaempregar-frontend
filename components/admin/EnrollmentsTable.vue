<template>
  <div>
    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="filters.search"
        type="search"
        placeholder="Buscar nome, CPF, email..."
        class="input-modern flex-1 min-w-[220px]"
        @keyup.enter="load(1)"
      />
      <select v-model="filters.status" class="input-modern w-auto min-w-[160px]" @change="load(1)">
        <option value="">Todos status</option>
        <option value="pendente">Pendente</option>
        <option value="em_analise">Em análise</option>
        <option value="repassado_parceiro">Repassado ao parceiro</option>
        <option value="confirmado_parceiro">Confirmado</option>
        <option value="concluido">Concluído</option>
        <option value="recusado">Recusado</option>
        <option value="cancelado">Cancelado</option>
        <option value="desistente">Desistente</option>
      </select>
      <button type="button" class="btn text-sm py-2" @click="load(1)">Filtrar</button>
      <AdminExportButton :filters="exportFilters" />
    </div>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div v-if="loading" class="bg-white rounded-lg shadow px-6 py-10 text-center text-muted text-sm">
      Carregando inscrições...
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Cidadão</th>
            <th class="px-4 py-3 font-medium">CPF</th>
            <th class="px-4 py-3 font-medium">Telefone</th>
            <th class="px-4 py-3 font-medium">Email</th>
            <th v-if="!scopedToCourse" class="px-4 py-3 font-medium">Curso</th>
            <th class="px-4 py-3 font-medium">Data</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!enrollments.length" class="border-t">
            <td :colspan="scopedToCourse ? 7 : 8" class="px-4 py-12 text-center">
              <p class="text-muted text-sm">{{ emptyMessage }}</p>
              <p class="text-xs text-muted mt-2">{{ emptyHint }}</p>
            </td>
          </tr>
          <tr v-for="item in enrollments" :key="item.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ item.user?.name || '—' }}</td>
            <td class="px-4 py-3">{{ userCpf(item.user) }}</td>
            <td class="px-4 py-3">{{ userPhone(item.user) }}</td>
            <td class="px-4 py-3">{{ item.user?.email || '—' }}</td>
            <td v-if="!scopedToCourse" class="px-4 py-3">{{ item.enrollable?.titulo || '—' }}</td>
            <td class="px-4 py-3">{{ formatDate(item.created_at) }}</td>
            <td class="px-4 py-3">
              <EnrollmentStatusBadge :status="item.status" />
            </td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="enrollmentActions(item)" />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-4 py-3 border-t text-sm">
        <p class="text-muted">{{ meta.total }} inscrição(ões)</p>
        <div class="flex gap-2 items-center">
          <AdminActionButton
            label="Anterior"
            variant="outline"
            :disabled="meta.current_page <= 1"
            @click="load(meta.current_page - 1)"
          />
          <span class="text-muted px-1">{{ meta.current_page }} / {{ meta.last_page }}</span>
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
import type { RowActionItem } from '~/types/row-action'

const props = withDefaults(
  defineProps<{
    courseId?: number
    emptyMessage?: string
    emptyHint?: string
  }>(),
  {
    emptyMessage: 'Nenhuma inscrição encontrada.',
    emptyHint: 'Quando cidadãos se inscreverem nos cursos, elas aparecerão aqui.',
  },
)

const scopedToCourse = computed(() => props.courseId != null)

const enrollments = ref<any[]>([])
const loading = ref(true)
const loadError = ref('')
const filters = reactive({ search: '', status: '' })
const meta = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
})

const exportFilters = computed(() => {
  const base: Record<string, string | number> = {
    search: filters.search,
    status: filters.status,
  }
  if (props.courseId != null) {
    base.course_id = props.courseId
  }
  return base
})

function userCpf(user?: { cpf?: string; profile?: { cpf?: string } }) {
  return user?.cpf || user?.profile?.cpf || '—'
}

function userPhone(user?: { phone?: string; profile?: { phone?: string } }) {
  return user?.phone || user?.profile?.phone || '—'
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR')
}

function enrollmentActions(item: any): RowActionItem[] {
  return [
    { label: 'Ver inscrição', to: `/admin/inscricoes/${item.id}` },
    {
      label: 'Ver cidadão',
      to: item.user?.id ? `/admin/cidadaos/${item.user.id}` : undefined,
      hidden: !item.user?.id,
    },
  ]
}

async function load(page = 1) {
  loading.value = true
  loadError.value = ''
  try {
    const params = new URLSearchParams({ page: String(page) })
    if (filters.search.trim()) params.set('search', filters.search.trim())
    if (filters.status) params.set('status', filters.status)
    if (props.courseId != null) {
      params.set('course_id', String(props.courseId))
    }
    const data = await useApi<any>(`/admin/enrollments?${params}`)
    enrollments.value = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? enrollments.value.length
  } catch (e: any) {
    enrollments.value = []
    loadError.value = e?.data?.message || 'Erro ao carregar inscrições.'
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>
