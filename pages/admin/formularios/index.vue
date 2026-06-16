<template>
  <div>
    <AdminHeader title="Formulários">
      <NuxtLink to="/admin/formularios/novo" class="btn text-sm py-2">+ Novo formulário</NuxtLink>
    </AdminHeader>

    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="search"
        type="search"
        placeholder="Buscar por título, slug ou ID..."
        class="input-modern flex-1 min-w-[220px]"
        @keyup.enter="load"
      />
      <button type="button" class="btn text-sm py-2" @click="load">Buscar</button>
      <NuxtLink to="/admin/formularios/respostas" class="btn btn-outline text-sm py-2">Todas as respostas</NuxtLink>
    </div>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>
    <div v-if="loading" class="text-muted text-sm">Carregando...</div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Título</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Respostas</th>
            <th class="px-4 py-3 text-left">Link</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length" class="border-t">
            <td colspan="5" class="px-4 py-8 text-center text-muted">Nenhum formulário cadastrado.</td>
          </tr>
          <tr v-for="f in rows" :key="f.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-primary">{{ f.title }}</td>
            <td class="px-4 py-3">
              <span class="capitalize">{{ statusLabel(f.status) }}</span>
              <span v-if="f.unique_submission" class="text-xs text-muted block">Resposta única</span>
            </td>
            <td class="px-4 py-3">{{ f.entries_count }}</td>
            <td class="px-4 py-3">
              <button type="button" class="text-accent text-xs hover:underline" @click="copyLink(f.slug)">
                Copiar link
              </button>
            </td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="formActions(f)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RowActionItem } from '~/types/row-action'
import { formPublicAbsoluteUrl } from '~/utils/formPublicUrl'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const config = useRuntimeConfig()
const dialog = useDialog()
const rows = ref<any[]>([])
const loading = ref(true)
const loadError = ref('')
const search = ref('')

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  active: 'Ativo',
  archived: 'Arquivado',
}

function statusLabel(s: string) {
  return statusLabels[s] || s
}

function formActions(f: any): RowActionItem[] {
  return [
    { label: 'Ajustes', to: `/admin/formularios/${f.id}` },
    { label: 'Perguntas', to: `/admin/formularios/${f.id}/campos` },
    { label: 'Respostas', to: `/admin/formularios/${f.id}/respostas` },
    { label: 'Gráficos', to: `/admin/formularios/${f.id}/analiticos` },
    { label: 'Ver público', to: `/formulario/${f.slug}` },
    { label: 'Duplicar', onClick: () => duplicate(f) },
    { label: 'Remover', danger: true, onClick: () => remove(f) },
  ]
}

async function copyLink(slug: string) {
  const url = formPublicAbsoluteUrl(slug, config.public.siteUrl as string)
  try {
    await navigator.clipboard.writeText(url)
    await dialog.toastSuccess('Link copiado!')
  } catch {
    await dialog.copyFallback(url)
  }
}

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const q = search.value.trim() ? `?search=${encodeURIComponent(search.value.trim())}` : ''
    rows.value = await useApi<any[]>(`/admin/forms${q}`)
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar formulários.'
  } finally {
    loading.value = false
  }
}

async function duplicate(f: any) {
  if (!await dialog.confirm(`Duplicar "${f.title}"?`, { title: 'Duplicar formulário' })) return
  try {
    const copy = await useApi<any>(`/admin/forms/${f.id}/duplicate`, { method: 'POST' })
    await navigateTo(`/admin/formularios/${copy.id}/campos`)
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível duplicar.')
  }
}

async function remove(f: any) {
  if (!await dialog.confirm(`Remover "${f.title}" e todas as respostas?`, {
    title: 'Remover formulário',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/forms/${f.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
