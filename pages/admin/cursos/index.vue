<template>
  <div>
    <AdminHeader title="Cursos">
      <AdminExportButton endpoint="/admin/exports/courses" filename="cursos" />
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
            <th class="px-4 py-3 text-left">Listado</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length">
            <td colspan="9" class="px-4 py-6 text-center text-muted">Nenhum curso cadastrado.</td>
          </tr>
          <tr v-for="c in rows" :key="c.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-primary">
              <div>{{ c.title }}</div>
              <div v-if="c.internal_title" class="text-xs text-muted font-normal mt-0.5">
                Interno: {{ c.internal_title }}
              </div>
              <div class="mt-1 flex flex-wrap gap-1">
                <span
                  v-if="c.women_only"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-100 text-pink-700"
                >
                  Só mulheres
                </span>
                <span
                  v-if="c.adults_only"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800"
                >
                  +18
                </span>
                <span
                  v-if="c.export_group_id"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700"
                >
                  Vinculado
                </span>
              </div>
            </td>
            <td class="px-4 py-3">{{ modalidadeLabel(c.modality) }}</td>
            <td class="px-4 py-3">{{ trilhaLabel(c.track) }}</td>
            <td class="px-4 py-3">{{ c.partner?.name || '—' }}</td>
            <td class="px-4 py-3">
              <InscricaoStatusBadge v-if="c.enrollment_status" :status="c.enrollment_status" />
              <span v-else class="text-muted">—</span>
            </td>
            <td class="px-4 py-3">
              {{ c.total_vacancies === 0 ? 'Ilimitadas' : c.total_vacancies }}
            </td>
            <td class="px-4 py-3">
              <span :class="c.active ? 'text-green-700' : 'text-red-600'">
                {{ c.active ? 'Sim' : 'Não' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span :class="c.listed ? 'text-green-700' : 'text-muted'">
                {{ c.listed ? 'Sim' : 'Não' }}
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
import { loadTracks, trackLabel } from '~/utils/tracks'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'courses' })

type CourseRow = {
  id: number
  title: string
  internal_title?: string | null
  export_group_id?: string | null
  track?: string
  modality?: string
  partner?: { name: string }
  enrollment_status?: string
  total_vacancies?: number
  active?: boolean
  listed?: boolean
  women_only?: boolean
  adults_only?: boolean
  sort_order?: number
}

const loading = ref(true)
const loadError = ref('')
const rows = ref<CourseRow[]>([])
const dialog = useDialog()
const trackMap = ref<Record<string, string>>({})

function trilhaLabel(trilha?: string) {
  return trackLabel(trilha, Object.entries(trackMap.value).map(([slug, name]) => ({ slug, name })))
}

function modalidadeLabel(modalidade?: string) {
  if (modalidade === 'online') return 'Online'
  if (modalidade === 'ead') return 'EAD'
  if (modalidade === 'presencial') return 'Presencial'
  return modalidade || '—'
}

function courseActions(c: CourseRow): RowActionItem[] {
  return [
    { label: 'Ver inscritos', to: `/admin/cursos/${c.id}/inscritos` },
    { label: 'Editar', to: `/admin/cursos/${c.id}` },
    { label: 'Duplicar', onClick: () => duplicateCourse(c) },
    {
      label: c.active ? 'Inativar' : 'Ativar',
      onClick: () => toggleActive(c),
    },
    { label: 'Remover', danger: true, onClick: () => removeCourse(c) },
  ]
}

async function loadRows() {
  loading.value = true
  loadError.value = ''
  try {
    const [data, tracks] = await Promise.all([
      useApi<any>('/admin/courses'),
      loadTracks(),
    ])
    trackMap.value = Object.fromEntries(tracks.map(t => [t.slug, t.name]))
    rows.value = (data.courses || []).sort((a: CourseRow, b: CourseRow) => {
      const ordemA = a.sort_order ?? 999
      const ordemB = b.sort_order ?? 999
      if (ordemA !== ordemB) return ordemA - ordemB
      return a.title.localeCompare(b.title, 'pt-BR')
    })
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar cursos.'
  } finally {
    loading.value = false
  }
}

async function duplicateCourse(c: CourseRow) {
  if (!await dialog.confirm(
    `Duplicar o curso "${c.title}"? A cópia já nasce vinculada para exportação (você pode desmarcar na edição) e sem listagem no site.`,
    { title: 'Duplicar curso', confirmText: 'Duplicar' },
  )) return

  try {
    const res = await useApi<any>(`/admin/courses/${c.id}/duplicate`, { method: 'POST' })
    const newId = res.course?.id
    if (!newId) {
      await dialog.error('Curso duplicado, mas não foi possível abrir a edição.')
      await loadRows()
      return
    }
    await navigateTo(`/admin/cursos/${newId}?link_from=${c.id}`)
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível duplicar o curso.')
  }
}

async function toggleActive(c: CourseRow) {
  const activating = !c.active
  if (!await dialog.confirm(
    activating
      ? `Ativar o curso "${c.title}"?`
      : `Inativar o curso "${c.title}"? Ele some da listagem e a URL deixa de funcionar.`,
    {
      title: activating ? 'Ativar curso' : 'Inativar curso',
      confirmText: activating ? 'Ativar' : 'Inativar',
      danger: !activating,
    },
  )) return

  try {
    await useApi(`/admin/courses/${c.id}/toggle-active`, { method: 'POST' })
    await loadRows()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível alterar o status do curso.')
  }
}

async function removeCourse(c: CourseRow) {
  if (!await dialog.confirm(`Remover o curso "${c.title}"? Esta ação pode ser revertida pelo suporte.`, {
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
