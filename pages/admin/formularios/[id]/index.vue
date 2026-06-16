<template>
  <div>
    <AdminHeader :title="form?.title || 'Editar formulário'">
      <NuxtLink v-if="form" :to="`/formulario/${form.slug}`" target="_blank" class="btn btn-outline text-sm py-2">Ver público</NuxtLink>
    </AdminHeader>

    <div v-if="loading" class="text-muted">Carregando...</div>
    <form v-else-if="form" @submit.prevent="save" class="max-w-3xl mx-auto space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <AdminFormSettingsFields :form="editForm" />
        <p v-if="form.public_url" class="text-xs text-muted mt-4">
          Link público:
          <button type="button" class="text-accent hover:underline" @click="copyLink">{{ publicUrl }}</button>
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <AdminActionButton :label="saving ? 'Salvando...' : 'Salvar'" variant="primary" size="md" :disabled="saving" submit />
        <AdminActionButton :to="`/admin/formularios/${id}/campos`" label="Perguntas" variant="outline" size="md" />
        <AdminActionButton to="/admin/formularios" label="Voltar" variant="outline" size="md" />
        <AdminActionButton label="Remover" variant="danger" size="md" @click="remove" />
      </div>
      <p v-if="message" class="text-sm text-accent">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { formPublicAbsoluteUrl } from '~/utils/formPublicUrl'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const config = useRuntimeConfig()
const dialog = useDialog()
const id = Number(route.params.id)

const form = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')

const editForm = reactive({
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

const publicUrl = computed(() =>
  form.value ? formPublicAbsoluteUrl(form.value.slug, config.public.siteUrl as string) : '',
)

function toLocalInput(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fillForm(f: any) {
  editForm.title = f.title
  editForm.description = f.description || ''
  editForm.status = f.status
  editForm.max_responses = f.max_responses
  editForm.start_datetime = toLocalInput(f.start_datetime)
  editForm.end_datetime = toLocalInput(f.end_datetime)
  editForm.is_anonymous = f.is_anonymous
  editForm.unique_submission = f.unique_submission
  editForm.unique_key_type = f.unique_key_type || 'email'
  editForm.custom_public_slug = f.custom_public_slug
  editForm.slug_custom = f.slug
  editForm.background_url = f.background_url || ''
  editForm.remove_background = false
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    await dialog.toastSuccess('Link copiado!')
  } catch {
    await dialog.copyFallback(publicUrl.value)
  }
}

onMounted(async () => {
  try {
    form.value = await useApi(`/admin/forms/${id}`)
    fillForm(form.value)
  } catch (e: any) {
    error.value = e?.data?.message || 'Formulário não encontrado.'
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    form.value = await useApi(`/admin/forms/${id}`, {
      method: 'PUT',
      body: {
        ...editForm,
        max_responses: editForm.max_responses || null,
        start_datetime: editForm.start_datetime || null,
        end_datetime: editForm.end_datetime || null,
      },
    })
    fillForm(form.value)
    message.value = 'Formulário atualizado.'
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!await dialog.confirm('Remover este formulário e todas as respostas?', {
    title: 'Remover formulário',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/forms/${id}`, { method: 'DELETE' })
    await navigateTo('/admin/formularios')
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível remover.'
  }
}
</script>
