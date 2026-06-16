<template>
  <div>
    <label v-if="label" class="form-label">{{ label }}</label>
    <p v-if="hint" class="text-xs text-muted mb-2">{{ hint }}</p>

    <div v-if="modelValue" class="mb-3 flex items-start gap-4">
      <img
        :src="resolveMediaUrl(modelValue)"
        :alt="label || 'Preview'"
        class="h-24 w-24 object-contain rounded-lg border border-slate-200 bg-white p-1"
      />
      <button
        type="button"
        class="text-xs text-red-600 hover:underline mt-1"
        :disabled="uploading"
        @click="clear"
      >
        Remover imagem
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <label
        class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-primary/30 bg-white text-primary hover:bg-primary/5 cursor-pointer transition-colors"
        :class="{ 'opacity-50 pointer-events-none': uploading }"
      >
        <input
          type="file"
          class="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          :disabled="uploading"
          @change="onFileChange"
        />
        {{ uploading ? 'Enviando...' : modelValue ? 'Trocar imagem' : 'Selecionar imagem' }}
      </label>
      <span class="text-xs text-muted">JPG, PNG ou WebP — até 5 MB</span>
    </div>

    <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { resolveMediaUrl } from '~/utils/media'

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
        context?: 'partner_logo' | 'course_image' | 'course_cover' | 'blog_cover' | 'acervo_cover'
  }>(),
  { context: 'course_image' },
)

const modelValue = defineModel<string>({ default: '' })

const uploading = ref(false)
const error = ref('')

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'A imagem deve ter no máximo 5 MB.'
    return
  }

  uploading.value = true
  error.value = ''

  try {
    await ensureSanctumCsrf()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('context', props.context)
    const data = await useApiForm<{ url: string }>('/admin/media', formData)
    modelValue.value = data.url
  } catch (e: any) {
    error.value = e?.data?.message || 'Não foi possível enviar a imagem.'
  } finally {
    uploading.value = false
  }
}

function clear() {
  modelValue.value = ''
  error.value = ''
}
</script>
