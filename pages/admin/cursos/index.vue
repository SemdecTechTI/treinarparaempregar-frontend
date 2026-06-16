<template>
  <div>
    <AdminHeader title="Cursos">
      <NuxtLink to="/admin/cursos/novo" class="btn text-sm py-2">+ Novo curso</NuxtLink>
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div v-if="loading" class="text-muted text-sm">Carregando cursos...</div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Título</th>
            <th class="px-4 py-3 text-left">Modalidade</th>
            <th class="px-4 py-3 text-left">Trilha</th>
            <th class="px-4 py-3 text-left">Parceiro</th>
            <th class="px-4 py-3 text-left">Inscrições</th>
            <th class="px-4 py-3 text-left">Vagas</th>
            <th class="px-4 py-3 text-left">Ativo</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length">
            <td colspan="8" class="px-4 py-6 text-center text-muted">Nenhum curso cadastrado.</td>
          </tr>
          <tr v-for="c in rows" :key="c.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-primary">{{ c.titulo }}</td>
            <td class="px-4 py-3">{{ modalidadeLabel(c.modalidade) }}</td>
            <td class="px-4 py-3">{{ trilhaLabel(c.trilha) }}</td>
            <td class="px-4 py-3">{{ c.partner?.name || '—' }}</td>
            <td class="px-4 py-3">
              <InscricaoStatusBadge v-if="c.inscricao_status" :status="c.inscricao_status" />
              <span v-else class="text-muted">—</span>
            </td>
            <td class="px-4 py-3">
              {{ c.vagas_totais === 0 ? 'Ilimitadas' : c.vagas_totais }}
            </td>
            <td class="px-4 py-3">
              <span :class="c.ativo ? 'text-green-700' : 'text-muted'">
                {{ c.ativo ? 'Sim' : 'Não' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="courseActions(c)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RowActionItem } from '~/types/row-action'

definePageMeta({ layout: 'admin', middleware: 'admin' })

type CourseRow = {
  id: number
  titulo: string
  trilha?: string
  modalidade?: string
  partner?: { name: string }
  inscricao_status?: string
  vagas_totais?: number
  ativo?: boolean
  ordem?: number
}

const loading = ref(true)
const loadError = ref('')
const rows = ref<CourseRow[]>([])
const dialog = useDialog()

const trilhaLabels: Record<string, string> = {
  base: 'Base (SIMM Prepara)',
  saude: 'Saúde',
  servicos: 'Serviços',
  tecnicos: 'Construção Civil',
}

function trilhaLabel(trilha?: string) {
  if (!trilha) return '—'
  return trilhaLabels[trilha] || trilha
}

function modalidadeLabel(modalidade?: string) {
  if (modalidade === 'ead') return 'EAD'
  if (modalidade === 'presencial') return 'Presencial'
  return modalidade || '—'
}

function courseActions(c: CourseRow): RowActionItem[] {
  return [
    { label: 'Ver inscritos', to: `/admin/cursos/${c.id}/inscritos` },
    { label: 'Editar', to: `/admin/cursos/${c.id}` },
    { label: 'Remover', danger: true, onClick: () => removeCourse(c) },
  ]
}

async function loadRows() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await useApi<any>('/admin/courses')
    rows.value = (data.courses || []).sort((a: CourseRow, b: CourseRow) => {
      const ordemA = a.ordem ?? 999
      const ordemB = b.ordem ?? 999
      if (ordemA !== ordemB) return ordemA - ordemB
      return a.titulo.localeCompare(b.titulo, 'pt-BR')
    })
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar cursos.'
  } finally {
    loading.value = false
  }
}

async function removeCourse(c: CourseRow) {
  if (!await dialog.confirm(`Remover o curso "${c.titulo}"?`, {
    title: 'Remover curso',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/courses/${c.id}`, { method: 'DELETE' })
    await loadRows()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(loadRows)
</script>
