<template>
  <div>
    <AdminHeader title="Blog">
      <AdminExportButton endpoint="/admin/exports/blog-posts" filename="blog_posts" />
      <AdminActionButton to="/admin/blog/novo" label="+ Novo artigo" variant="primary" size="md" />
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Título</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Publicação</th>
            <th class="px-4 py-3 text-left whitespace-nowrap">Cadastro</th>
            <th class="px-4 py-3 text-left">Destaque</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!posts.length" class="border-t">
            <td colspan="6" class="px-4 py-6 text-center text-muted">Nenhum artigo cadastrado.</td>
          </tr>
          <tr v-for="post in posts" :key="post.id" class="border-t">
            <td class="px-4 py-3">
              <p class="font-medium text-primary">{{ post.title }}</p>
              <p class="text-xs text-muted truncate max-w-xs">{{ post.slug }}</p>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                :class="post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
              >
                {{ post.status === 'published' ? 'Publicado' : 'Rascunho' }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDateTime(post.published_at) }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-muted">{{ formatDateTime(post.created_at) }}</td>
            <td class="px-4 py-3">{{ post.featured ? 'Sim' : '—' }}</td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Editar', onClick: () => navigateTo(`/admin/blog/${post.id}`) },
                { label: 'Ver no site', onClick: () => openPublic(post), hidden: post.status !== 'published' },
                { label: 'Remover', danger: true, onClick: () => remove(post) },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>

      <AdminPagination :meta="meta" @change="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '~/utils/datetime'

definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'blog' })

const posts = ref<any[]>([])
const loadError = ref('')
const dialog = useDialog()
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })

function openPublic(post: any) {
  if (post.status !== 'published') return
  window.open(`/blog/${post.slug}`, '_blank')
}

async function load(page = meta.current_page) {
  try {
    const data = await useApi<any>(`/admin/blog-posts?page=${page}`)
    posts.value = data.data ?? []
    meta.current_page = data.current_page ?? 1
    meta.last_page = data.last_page ?? 1
    meta.total = data.total ?? posts.value.length
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar artigos.'
  }
}

async function remove(post: any) {
  if (!await dialog.confirm(`Remover artigo "${post.title}"?`, {
    title: 'Remover artigo',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/blog-posts/${post.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    await dialog.error(e?.data?.message || 'Não foi possível remover.')
  }
}

onMounted(load)
</script>
