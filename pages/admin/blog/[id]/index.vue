<template>
  <div>
    <AdminHeader :title="post?.titulo || 'Editar artigo'" />
    <div v-if="loading" class="text-muted">Carregando...</div>
    <p v-else-if="error && !post" class="text-red-600 text-sm">{{ error }}</p>

    <form v-else-if="post" @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <AdminBlogPostForm :form="form" />

      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton
          v-if="post.status === 'published'"
          label="Ver no site"
          variant="outline"
          size="md"
          @click="openPublic"
        />
        <AdminActionButton to="/admin/blog" label="Voltar" variant="outline" size="md" />
        <AdminActionButton label="Remover" variant="danger" size="md" :disabled="saving" @click="remove" />
      </div>
      <p v-if="message" class="text-sm text-accent">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const dialog = useDialog()
const id = Number(route.params.id)

const post = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')

const form = reactive({
  titulo: '',
  excerpt: '',
  content: '',
  cover_image: '',
  status: 'draft',
  published_at: '',
  featured: false,
  ordem: 0,
  meta_title: '',
  meta_description: '',
  og_image: '',
  canonical_url: '',
})

function toLocalInput(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

onMounted(async () => {
  try {
    post.value = await useApi(`/admin/blog-posts/${id}`)
    form.titulo = post.value.titulo
    form.excerpt = post.value.excerpt || ''
    form.content = post.value.content || ''
    form.cover_image = post.value.cover_image || ''
    form.status = post.value.status || 'draft'
    form.published_at = toLocalInput(post.value.published_at)
    form.featured = post.value.featured ?? false
    form.ordem = post.value.ordem ?? 0
    form.meta_title = post.value.meta_title || ''
    form.meta_description = post.value.meta_description || ''
    form.og_image = post.value.og_image || ''
    form.canonical_url = post.value.canonical_url || ''
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar artigo.'
  } finally {
    loading.value = false
  }
})

function openPublic() {
  if (post.value?.slug) window.open(`/blog/${post.value.slug}`, '_blank')
}

async function save() {
  if (!form.content?.replace(/<[^>]+>/g, '').trim()) {
    error.value = 'O conteúdo do artigo é obrigatório.'
    return
  }
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    await useApi(`/admin/blog-posts/${id}`, {
      method: 'PUT',
      body: {
        ...form,
        ordem: Number(form.ordem) || 0,
        published_at: form.published_at || null,
        canonical_url: form.canonical_url || null,
      },
    })
    message.value = 'Artigo atualizado com sucesso.'
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!await dialog.confirm(`Remover o artigo "${post.value?.titulo}"?`, {
    title: 'Remover artigo',
    confirmText: 'Remover',
    danger: true,
  })) return
  saving.value = true
  try {
    await useApi(`/admin/blog-posts/${id}`, { method: 'DELETE' })
    await navigateTo('/admin/blog')
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível remover.'
    saving.value = false
  }
}
</script>
