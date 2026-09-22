<template>
  <div>
    <AdminHeader title="Log de atividades" />

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          v-model="filters.q"
          type="text"
          placeholder="Buscar por item, usuário, módulo…"
          class="input-modern"
        />
        <select v-model="filters.module" class="input-modern">
          <option value="">Todos os módulos</option>
          <option v-for="m in meta.modules" :key="m.key" :value="m.key">{{ m.label }}</option>
        </select>
        <select v-model="filters.action" class="input-modern">
          <option value="">Todas as ações</option>
          <option v-for="a in meta.actions" :key="a.key" :value="a.key">{{ a.label }}</option>
        </select>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="filters.from" type="date" class="input-modern min-w-0" title="De" aria-label="De" />
          <input v-model="filters.to" type="date" class="input-modern min-w-0" title="Até" aria-label="Até" />
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left whitespace-nowrap">Data/hora</th>
            <th class="px-4 py-3 text-left">Usuário</th>
            <th class="px-4 py-3 text-left">Ação</th>
            <th class="px-4 py-3 text-left">Módulo</th>
            <th class="px-4 py-3 text-left">Item</th>
            <th class="px-4 py-3 text-right">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="n in 6" :key="n" class="border-t">
              <td class="px-4 py-3"><div class="skeleton h-3 w-28" /></td>
              <td class="px-4 py-3"><div class="skeleton h-3 w-36" /></td>
              <td class="px-4 py-3"><div class="skeleton h-3 w-20" /></td>
              <td class="px-4 py-3"><div class="skeleton h-3 w-24" /></td>
              <td class="px-4 py-3"><div class="skeleton h-3 w-40" /></td>
              <td class="px-4 py-3"><div class="skeleton h-3 w-16 ml-auto" /></td>
            </tr>
          </template>
          <tr v-else-if="!logs.length" class="border-t">
            <td colspan="6" class="px-4 py-6 text-center text-muted">Nenhum registro encontrado.</td>
          </tr>
          <tr v-for="log in logs" :key="log.id" class="border-t hover:bg-gray-50 align-top">
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDate(log.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="font-medium">{{ log.user_name || '—' }}</div>
              <div class="text-xs text-muted">{{ log.user_email }}</div>
            </td>
            <td class="px-4 py-3">
              <span class="inline-block text-xs font-semibold px-2.5 py-1 rounded-full" :class="actionClass(log.action)">
                {{ actionLabel(log.action) }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">{{ log.module_label }}</td>
            <td class="px-4 py-3">{{ log.subject_label || `#${log.subject_id ?? ''}` }}</td>
            <td class="px-4 py-3 text-right">
              <button
                v-if="hasDetails(log)"
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
                aria-label="Ver o que foi alterado"
                @click="detailLog = log"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </button>
              <span v-else class="text-muted text-xs">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div v-if="lastPage > 1" class="flex items-center justify-between mt-4 text-sm">
      <span class="text-muted">Página {{ currentPage }} de {{ lastPage }} · {{ total }} registro(s)</span>
      <div class="flex gap-2">
        <button type="button" class="btn btn-outline text-sm py-2 disabled:opacity-40" :disabled="currentPage <= 1 || loading" @click="goTo(currentPage - 1)">Anterior</button>
        <button type="button" class="btn btn-outline text-sm py-2 disabled:opacity-40" :disabled="currentPage >= lastPage || loading" @click="goTo(currentPage + 1)">Próxima</button>
      </div>
    </div>

    <!-- Modal de detalhes da alteração -->
    <Teleport to="body">
      <div v-if="detailLog" class="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="detailLog = null" />
        <div class="relative bg-white rounded-2xl shadow-card w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
          <div class="flex items-start justify-between gap-3 p-5 border-b border-gray-100">
            <div class="min-w-0">
              <h3 class="font-semibold text-primary">O que foi alterado</h3>
              <p class="text-sm text-muted truncate">
                {{ actionLabel(detailLog.action) }} · {{ detailLog.module_label }} · {{ detailLog.subject_label || `#${detailLog.subject_id ?? ''}` }}
              </p>
            </div>
            <button type="button" class="shrink-0 text-muted hover:text-primary" aria-label="Fechar" @click="detailLog = null">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="p-5 overflow-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs uppercase text-muted">
                  <th class="pb-2 pr-3 font-semibold">Campo</th>
                  <th class="pb-2 pr-3 font-semibold">Antes</th>
                  <th class="pb-2 font-semibold">Depois</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in changeRows(detailLog)" :key="row.field" class="border-t border-gray-100 align-top">
                  <td class="py-2.5 pr-3 font-medium text-text whitespace-nowrap">{{ row.field }}</td>
                  <td class="py-2.5 pr-3 text-red-600 break-words">{{ formatValue(row.old) }}</td>
                  <td class="py-2.5 text-green-700 break-words">{{ formatValue(row.new) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminOnly: true })

type Option = { key: string; label: string }
type Log = {
  id: number
  user_name: string | null
  user_email: string | null
  action: string
  module_label: string
  subject_label: string | null
  subject_id: number | null
  created_at: string
  properties: any
}
type ChangeRow = { field: string; old: unknown; new: unknown }

const detailLog = ref<Log | null>(null)

const fieldLabels: Record<string, string> = {
  name: 'Nome', email: 'E-mail', role: 'Perfil', title: 'Título', description: 'Descrição',
  status: 'Status', active: 'Ativo', listed: 'Listado', password: 'Senha', phone: 'Telefone',
  admin_profile_id: 'Perfil de acesso', permissions: 'Permissões', slug: 'Slug',
  workload: 'Carga horária', modality: 'Modalidade', location: 'Local', total_vacancies: 'Vagas',
}
function fieldLabel(key: string) {
  return fieldLabels[key] || key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'boolean') return v ? 'Sim' : 'Não'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
const IGNORED_FIELDS = new Set([
  'id', 'created_at', 'updated_at', 'deleted_at', 'remember_token', 'email_verified_at',
  'password', 'email_change_code', 'pending_email', 'email_change_expires_at',
])
function cleanEntries(obj: Record<string, unknown>): [string, unknown][] {
  return Object.entries(obj).filter(
    ([k, v]) => !IGNORED_FIELDS.has(k) && v !== null && v !== undefined && v !== '',
  )
}
function changeRows(log: Log | null): ChangeRow[] {
  const p = log?.properties
  if (!p || typeof p !== 'object') return []
  if (p.changes && typeof p.changes === 'object' && Object.keys(p.changes).length) {
    return Object.entries(p.changes).map(([field, val]: [string, any]) => ({
      field: fieldLabel(field), old: val?.old, new: val?.new,
    }))
  }
  if (p.new && typeof p.new === 'object' && Object.keys(p.new).length) {
    return cleanEntries(p.new).map(([field, val]) => ({ field: fieldLabel(field), old: undefined, new: val }))
  }
  if (p.old && typeof p.old === 'object' && Object.keys(p.old).length) {
    return cleanEntries(p.old).map(([field, val]) => ({ field: fieldLabel(field), old: val, new: undefined }))
  }
  return []
}
function hasDetails(log: Log): boolean {
  return changeRows(log).length > 0
}

const logs = ref<Log[]>([])
const meta = reactive<{ modules: Option[]; actions: Option[] }>({ modules: [], actions: [] })
const loading = ref(false)
const loadError = ref('')

const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const filters = reactive({ q: '', module: '', action: '', from: '', to: '' })

const actionLabels: Record<string, string> = { created: 'Cadastro', updated: 'Alteração', deleted: 'Exclusão' }
function actionLabel(a: string) {
  return actionLabels[a] || a
}
function actionClass(a: string) {
  return {
    created: 'bg-green-100 text-green-700',
    updated: 'bg-blue-100 text-blue-700',
    deleted: 'bg-red-100 text-red-700',
  }[a] || 'bg-gray-100 text-gray-600'
}

function formatDate(value: string) {
  if (!value) return '—'
  const d = new Date(value)
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const query: Record<string, string | number> = { page: currentPage.value, per_page: 30 }
    if (filters.q) query.q = filters.q
    if (filters.module) query.module = filters.module
    if (filters.action) query.action = filters.action
    if (filters.from) query.from = filters.from
    if (filters.to) query.to = filters.to

    const res = await useApi<{ data: Log[]; current_page: number; last_page: number; total: number }>(
      '/admin/activity-logs',
      { query },
    )
    logs.value = res.data
    currentPage.value = res.current_page
    lastPage.value = res.last_page
    total.value = res.total
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar o log de atividades.'
  } finally {
    loading.value = false
  }
}

function goTo(page: number) {
  currentPage.value = page
  load()
}

// Recarrega quando muda um filtro (volta pra página 1); busca com debounce
let debounce: ReturnType<typeof setTimeout>
watch(() => [filters.module, filters.action, filters.from, filters.to], () => {
  currentPage.value = 1
  load()
})
watch(() => filters.q, () => {
  clearTimeout(debounce)
  debounce = setTimeout(() => { currentPage.value = 1; load() }, 400)
})

onMounted(async () => {
  try {
    const m = await useApi<{ modules: Option[]; actions: Option[] }>('/admin/activity-logs/meta')
    meta.modules = m.modules
    meta.actions = m.actions
  } catch {
    // meta é opcional; segue sem filtros de select
  }
  await load()
})
</script>
