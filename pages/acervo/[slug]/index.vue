<template>
  <div class="container mx-auto px-4 py-12 pb-20">
    <div v-if="loading" class="text-center py-12 text-muted">Carregando...</div>

    <div v-else-if="acervo">
      <nav class="mb-6">
        <NuxtLink to="/acervo" class="text-sm text-muted hover:text-primary inline-flex items-center gap-1">
          ← Voltar ao acervo
        </NuxtLink>
      </nav>

      <div class="grid lg:grid-cols-3 gap-8 items-start">
        <div class="lg:col-span-2">
          <h1 class="text-2xl lg:text-3xl font-semibold text-primary mb-2">{{ acervo.titulo }}</h1>
          <p v-if="acervo.descricao" class="text-muted mb-6">{{ acervo.descricao }}</p>

          <div v-if="!acervo.enrolled" class="card-modern p-6 text-center">
            <p class="text-muted mb-4">Inscreva-se para assistir aos vídeos deste acervo.</p>
            <button type="button" class="btn" :disabled="enrolling" @click="enroll">
              {{ enrolling ? 'Inscrevendo...' : 'Inscrever-se e assistir' }}
            </button>
            <p v-if="enrollError" class="text-red-600 text-sm mt-3">{{ enrollError }}</p>
          </div>

          <template v-else>
            <ProgressBar :percent="acervo.progress_percent || 0" class="mb-6 max-w-md" />

            <div class="bg-white rounded-xl shadow p-4 lg:p-6">
              <AcervoVideoList
                :videos="acervo.videos"
                :acervo-slug="slug"
              />
            </div>

            <div class="mt-8 text-center">
              <NuxtLink
                v-if="firstIncompleteVideo"
                :to="`/acervo/${slug}/video/${firstIncompleteVideo.id}`"
                class="btn"
              >
                {{ acervo.progress_percent > 0 ? 'Continuar de onde parei' : 'Assistir primeiro vídeo' }}
              </NuxtLink>
            </div>
          </template>
        </div>

        <aside v-if="acervo.capa" class="card-modern overflow-hidden">
          <img :src="coverUrl" :alt="acervo.titulo" class="w-full aspect-video object-cover" />
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveMediaUrl } from '~/utils/media'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const slug = route.params.slug as string

const acervo = ref<any>(null)
const loading = ref(true)
const enrolling = ref(false)
const enrollError = ref('')

const coverUrl = computed(() => acervo.value?.capa ? resolveMediaUrl(acervo.value.capa) : null)

const firstIncompleteVideo = computed(() => {
  if (!acervo.value?.videos) return null
  const incomplete = acervo.value.videos.find((v: any) => !v.progress?.completed)
  return incomplete || acervo.value.videos[0]
})

async function load() {
  loading.value = true
  try {
    const data = await useApi<any>(`/acervos/${slug}`)
    acervo.value = data.acervo
  } finally {
    loading.value = false
  }
}

async function enroll() {
  enrolling.value = true
  enrollError.value = ''
  try {
    await useApi(`/acervos/${slug}/enroll`, { method: 'POST' })
    await load()
  } catch (e: any) {
    enrollError.value = e?.data?.message || 'Não foi possível inscrever.'
  } finally {
    enrolling.value = false
  }
}

onMounted(load)
</script>
