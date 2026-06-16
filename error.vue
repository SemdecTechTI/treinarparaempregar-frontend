<template>
  <div class="min-h-screen flex flex-col bg-[#f4f7fb]">
    <header class="border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div class="container mx-auto px-4 h-16 flex items-center">
        <AppLogo variant="light" link-class="inline-block" />
      </div>
    </header>

    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="text-center max-w-lg">
        <p class="text-6xl lg:text-7xl font-semibold text-primary/20 mb-4">{{ statusCode }}</p>

        <h1 class="text-2xl lg:text-3xl font-semibold text-primary mb-3">
          {{ title }}
        </h1>

        <p class="text-muted mb-8 leading-relaxed">
          {{ description }}
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <button type="button" class="btn" @click="goHome">
            Ir para a home
          </button>
          <NuxtLink v-if="statusCode === 404" to="/cursos" class="btn btn-outline">
            Ver cursos
          </NuxtLink>
          <button v-else type="button" class="btn btn-outline" @click="retry">
            Tentar novamente
          </button>
        </div>
      </div>
    </main>

    <footer class="py-6 text-center text-xs text-muted">
      Treinar para Empregar — Prefeitura de Salvador
    </footer>
  </div>
</template>

<script setup lang="ts">
const error = useError()

const statusCode = computed(() => error.value?.statusCode || 500)

const is404 = computed(() => statusCode.value === 404)

const title = computed(() => {
  if (is404.value) return 'Página não encontrada'
  if (statusCode.value >= 500) return 'Erro interno do servidor'
  return 'Algo deu errado'
})

const description = computed(() => {
  if (error.value?.message && error.value.message !== error.value.statusMessage) {
    return error.value.message
  }
  if (is404.value) {
    return 'O link pode estar incorreto ou a página foi removida. Verifique o endereço ou volte ao início.'
  }
  if (statusCode.value >= 500) {
    return 'Tivemos um problema ao processar sua solicitação. Nossa equipe já pode estar trabalhando nisso. Tente novamente em instantes.'
  }
  return 'Não foi possível completar esta ação. Tente novamente.'
})

useHead({
  title: `${statusCode.value} — ${title.value}`,
})

function goHome() {
  clearError({ redirect: '/' })
}

function retry() {
  clearError()
}
</script>
