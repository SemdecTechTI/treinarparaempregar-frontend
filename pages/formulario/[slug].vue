<template>
  <TpeFormRenderer
    v-if="payload"
    :form="payload.form"
    :fields="payload.fields"
    :preview="payload.preview"
    :has-conditional-fields="payload.has_conditional_fields"
  />
  <div v-else-if="error" class="min-h-screen flex items-center justify-center p-8 text-center">
    <p class="text-muted">{{ error }}</p>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-muted">Carregando formulário...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

definePageMeta({ layout: 'form' })

useHead({
  link: [{ rel: 'stylesheet', href: '/_nuxt/assets/css/tpe-form.css' }],
})

const { data: payload, error: fetchError } = await useAsyncData(`form-${slug}`, async () => {
  try {
    return await useApiPublic<any>(`/forms/${slug}`)
  } catch {
    return null
  }
})

if (!payload.value?.form) {
  throw createError({ statusCode: 404, statusMessage: 'Formulário não encontrado', fatal: true })
}

const error = computed(() => fetchError.value ? 'Formulário não encontrado.' : '')

watch(payload, (value) => {
  if (!value?.form) return
  usePageSeo({
    title: value.form.title,
    description: value.form.description?.slice(0, 160) || undefined,
    path: `/formulario/${slug}`,
  })
}, { immediate: true })
</script>

<style>
@import '~/assets/css/tpe-form.css';
</style>
