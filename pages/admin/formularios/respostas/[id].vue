<template>
  <div>
    <AdminHeader title="Detalhe da resposta">
      <AdminActionButton to="/admin/formularios/respostas" label="Voltar" variant="outline" size="md" />
    </AdminHeader>

    <div v-if="loading" class="text-muted">Carregando...</div>
    <div v-else-if="entry" class="max-w-3xl space-y-6">
      <div class="bg-white rounded-lg shadow p-6 text-sm space-y-2">
        <p><span class="text-muted">Formulário:</span> {{ entry.form?.title }}</p>
        <p><span class="text-muted">Data:</span> {{ formatDate(entry.submitted_at) }}</p>
        <p v-if="entry.name"><span class="text-muted">Nome:</span> {{ entry.name }}</p>
        <p v-if="entry.email"><span class="text-muted">E-mail:</span> {{ entry.email }}</p>
        <p v-if="entry.respondent_key_display"><span class="text-muted">Identificador:</span> {{ entry.respondent_key_display }}</p>
        <p v-if="entry.ip"><span class="text-muted">IP:</span> {{ entry.ip }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 class="font-semibold text-primary">Respostas</h2>
        <div v-for="v in entry.values" :key="v.field_id" class="border-t pt-4 first:border-0 first:pt-0">
          <p class="font-medium text-sm">{{ v.label }}</p>
          <p v-if="v.file" class="mt-1">
            <a :href="v.file.url" target="_blank" class="text-accent">{{ v.file.file_name }}</a>
            <button type="button" class="text-xs text-red-600 ml-3" @click="removeFile(v.file.id)">Remover arquivo</button>
          </p>
          <p v-else class="text-muted mt-1">{{ v.display_value || '—' }}</p>
        </div>
      </div>

      <AdminActionButton label="Remover resposta" variant="danger" size="md" @click="removeEntry" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const dialog = useDialog()
const entry = ref<any>(null)
const loading = ref(true)

function formatDate(d: string) {
  return d ? new Date(d).toLocaleString('pt-BR') : '—'
}

onMounted(async () => {
  entry.value = await useApi(`/admin/form-entries/${id}`)
  loading.value = false
})

async function removeFile(fileId: number) {
  if (!await dialog.confirm('Remover este arquivo?', { title: 'Remover arquivo', confirmText: 'Remover', danger: true })) return
  await useApi(`/admin/form-entries/${id}/files/${fileId}`, { method: 'DELETE' })
  entry.value = await useApi(`/admin/form-entries/${id}`)
}

async function removeEntry() {
  if (!await dialog.confirm('Remover esta resposta?', { title: 'Remover resposta', confirmText: 'Remover', danger: true })) return
  await useApi(`/admin/form-entries/${id}`, { method: 'DELETE' })
  await navigateTo('/admin/formularios/respostas')
}
</script>
