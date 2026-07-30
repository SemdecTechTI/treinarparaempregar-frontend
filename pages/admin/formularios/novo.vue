<template>
  <div>
    <AdminHeader title="Novo formulário" />
    <form @submit.prevent="save" class="max-w-3xl mx-auto space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <AdminFormSettingsFields :form="form" />
      </div>
      <div class="flex gap-3">
        <AdminActionButton :label="saving ? 'Criando...' : 'Criar e adicionar perguntas'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton to="/admin/formularios" label="Cancelar" variant="outline" size="md" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'forms' })

const saving = ref(false)
const error = ref('')
const form = reactive({
  title: '',
  description: '',
  status: 'draft',
  max_responses: null as number | null,
  start_datetime: '',
  end_datetime: '',
  is_anonymous: false,
  unique_submission: false,
  unique_key_type: 'email',
  custom_public_slug: false,
  slug_custom: '',
  background_url: '',
  remove_background: false,
})

async function save() {
  saving.value = true
  error.value = ''
  try {
    const body = {
      ...form,
      max_responses: form.max_responses || null,
      start_datetime: form.start_datetime || null,
      end_datetime: form.end_datetime || null,
    }
    const created = await useApi<any>('/admin/forms', { method: 'POST', body })
    await navigateTo(`/admin/formularios/${created.id}/campos`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao criar formulário.'
  } finally {
    saving.value = false
  }
}
</script>
