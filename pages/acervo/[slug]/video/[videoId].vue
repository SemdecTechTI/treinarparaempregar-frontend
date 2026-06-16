<template>
  <div class="container mx-auto px-4 py-8 pb-20">
    <div v-if="loading" class="text-center py-12">Carregando vídeo...</div>

    <div v-else-if="!video || !acervo" class="text-center py-12">
      <p class="text-muted mb-4">Vídeo não encontrado ou você precisa se inscrever no acervo.</p>
      <NuxtLink to="/acervo" class="btn btn-outline text-sm">Voltar ao acervo</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <nav class="mb-4">
          <NuxtLink :to="`/acervo/${slug}`" class="text-sm text-muted hover:text-primary">
            ← {{ acervo.titulo }}
          </NuxtLink>
        </nav>

        <h1 class="text-2xl mb-4">{{ video.titulo }}</h1>

        <VideoPlayer
          :video-url="video.video_url"
          :acervo-video-id="video.id"
          :duration="video.duracao_segundos || 1"
          progress-type="acervo_video"
        />

        <p v-if="video.descricao" class="mt-4 text-sm text-muted">{{ video.descricao }}</p>

        <div class="flex gap-4 mt-6">
          <NuxtLink
            v-if="prevVideo"
            :to="`/acervo/${slug}/video/${prevVideo.id}`"
            class="btn bg-gray-500 hover:bg-gray-600 text-sm"
          >
            ← Vídeo anterior
          </NuxtLink>
          <NuxtLink
            v-if="nextVideo"
            :to="`/acervo/${slug}/video/${nextVideo.id}`"
            class="btn text-sm"
          >
            Próximo vídeo →
          </NuxtLink>
        </div>
      </div>

      <aside class="bg-white rounded-lg shadow p-4">
        <AcervoVideoList
          :videos="allVideos"
          :acervo-slug="slug"
          :current-video-id="videoId"
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const slug = route.params.slug as string
const videoId = Number(route.params.videoId)

const acervo = ref<any>(null)
const video = ref<any>(null)
const allVideos = ref<any[]>([])
const loading = ref(true)

const currentIndex = computed(() => allVideos.value.findIndex(v => v.id === videoId))
const prevVideo = computed(() => currentIndex.value > 0 ? allVideos.value[currentIndex.value - 1] : null)
const nextVideo = computed(() =>
  currentIndex.value < allVideos.value.length - 1 ? allVideos.value[currentIndex.value + 1] : null,
)

onMounted(async () => {
  try {
    const data = await useApi<any>(`/acervos/${slug}`)
    acervo.value = data.acervo
    allVideos.value = data.acervo?.videos || []
    video.value = allVideos.value.find((v: any) => v.id === videoId)

    if (!data.acervo?.enrolled) {
      await useApi(`/acervos/${slug}/enroll`, { method: 'POST' })
      const refreshed = await useApi<any>(`/acervos/${slug}`)
      acervo.value = refreshed.acervo
      allVideos.value = refreshed.acervo?.videos || []
      video.value = allVideos.value.find((v: any) => v.id === videoId)
    }
  } finally {
    loading.value = false
  }
})
</script>
