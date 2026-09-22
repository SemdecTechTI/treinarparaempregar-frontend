<template>
  <div>
    <AdminHeader title="Novo artigo" />
    <form @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <AdminBlogPostForm :form="form" />

      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Criar artigo'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton to="/admin/blog" label="Voltar" variant="outline" size="md" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'blog' })

const dialog = useDialog()
const saving = ref(false)

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  status: 'draft',
  published_at: '',
  featured: false,
  sort_order: 0,
  meta_title: '',
  meta_description: '',
  og_image: '',
  canonical_url: '',
})

async function save() {
  if (!form.content?.replace(/<[^>]+>/g, '').trim()) {
    await dialog.toastError('O conteúdo do artigo é obrigatório.')
    return
  }
  saving.value = true
  try {
    const created = await useApi<any>('/admin/blog-posts', {
      method: 'POST',
      body: {
        ...form,
        sort_order: Number(form.sort_order) || 0,
        published_at: form.published_at || null,
        canonical_url: form.canonical_url || null,
      },
    })
    await dialog.toastSuccess('Artigo criado.')
    await navigateTo(`/admin/blog/${created.id}`)
  } catch (e: any) {
    await dialog.toastError(e?.data?.message || 'Erro ao criar artigo.')
  } finally {
    saving.value = false
  }
}
</script>
