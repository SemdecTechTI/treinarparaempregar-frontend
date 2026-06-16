<template>
  <div>
    <AdminHeader title="Novo acervo" />
    <form @submit.prevent="save" class="w-full max-w-4xl mx-auto space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <AdminAcervoForm :form="form" />
      </div>

      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Criando...' : 'Criar acervo'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton to="/admin/acervo" label="Voltar" variant="outline" size="md" />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const saving = ref(false)
const error = ref('')

const form = reactive({
  titulo: '',
  descricao: '',
  capa: '',
  ativo: true,
  ordem: 0,
})

async function save() {
  saving.value = true
  error.value = ''
  try {
    const created = await useApi<any>('/admin/acervos', {
      method: 'POST',
      body: { ...form, ordem: Number(form.ordem) || 0 },
    })
    await navigateTo(`/admin/acervo/${created.id}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao criar acervo.'
  } finally {
    saving.value = false
  }
}
</script>
