<template>
  <TpeFormRenderer
    v-if="loaded"
    :form="data.form"
    :fields="data.fields"
    :preview="data.preview"
    :has-conditional-fields="data.has_conditional_fields"
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

const loaded = ref(false)
const error = ref('')
const data = ref<any>(null)

useHead({
  link: [{ rel: 'stylesheet', href: '/_nuxt/assets/css/tpe-form.css' }],
})

onMounted(async () => {
  try {
    data.value = await useApiPublic<any>(`/forms/${slug}`)
    usePageSeo({
      title: data.value.form.title,
      description: data.value.form.description?.slice(0, 160) || undefined,
      path: `/formulario/${slug}`,
    })
    loaded.value = true
  } catch {
    error.value = 'Formulário não encontrado.'
  }
})
</script>

<style>
@import '~/assets/css/tpe-form.css';
</style>
