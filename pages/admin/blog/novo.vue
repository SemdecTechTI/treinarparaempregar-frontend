<template>
  <div>
    <AdminHeader title="Novo artigo" />
    <form @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <AdminBlogPostForm :form="form" />

      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Criar artigo'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton to="/admin/blog" label="Voltar" variant="outline" size="md" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'blog' })

const saving = ref(false)
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

async function save() {
  if (!form.content?.replace(/<[^>]+>/g, '').trim()) {
    error.value = 'O conteúdo do artigo é obrigatório.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const created = await useApi<any>('/admin/blog-posts', {
      method: 'POST',
      body: {
        ...form,
        ordem: Number(form.ordem) || 0,
        published_at: form.published_at || null,
        canonical_url: form.canonical_url || null,
      },
    })
    await navigateTo(`/admin/blog/${created.id}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao criar artigo.'
  } finally {
    saving.value = false
  }
}
</script>
