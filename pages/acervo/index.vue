<template>
  <div class="container mx-auto px-4 py-12 lg:py-16 pb-20">
    <div class="mb-10">
      <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Conteúdo em vídeo</p>
      <h1 class="section-title">Acervo</h1>
      <p class="text-muted mt-3 max-w-2xl">
        Coleções de vídeos para qualificação e preparação para o mercado de trabalho. Disponível para cidadãos cadastrados.
      </p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="skeleton h-80 rounded-2xl" />
    </div>

    <p v-else-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <div v-else-if="!acervos.length" class="text-center py-20 card-modern">
      <p class="text-muted">Nenhum acervo disponível no momento.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AcervoCard v-for="item in acervos" :key="item.id" :acervo="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

usePageSeo({
  title: 'Acervo',
  description: 'Vídeos e conteúdos do programa Treinar para Empregar para cidadãos cadastrados.',
  path: '/acervo',
})

const acervos = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    acervos.value = await useApi<any[]>('/acervos')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar acervos.'
  } finally {
    loading.value = false
  }
})
</script>
