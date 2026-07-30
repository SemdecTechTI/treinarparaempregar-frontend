<template>
  <div class="container mx-auto px-4 py-8 pb-20">
    <div v-if="loading" class="text-center py-12">Carregando vídeo...</div>

    <div v-else-if="!video || !course" class="text-center py-12">
      <p class="text-muted mb-4">Vídeo não encontrado ou você precisa se inscrever no curso.</p>
      <NuxtLink :to="`/cursos/${slug}`" class="btn btn-outline text-sm">Voltar ao curso</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <nav class="mb-4">
          <NuxtLink :to="`/cursos/${slug}`" class="text-sm text-muted hover:text-primary">
            ← {{ course.title }}
          </NuxtLink>
        </nav>

        <h1 class="text-2xl mb-4">{{ video.title }}</h1>

        <VideoPlayer
          v-if="video.video_url"
          :video-url="video.video_url"
          :course-video-id="video.id"
          :duration="video.duration_seconds || 1"
          progress-type="course_video"
        />
        <p v-else class="text-muted text-sm py-8 text-center bg-gray-50 rounded-lg">
          Inscreva-se no curso para assistir este vídeo.
        </p>

        <p v-if="video.description" class="mt-4 text-sm text-muted">{{ video.description }}</p>

        <div class="flex gap-4 mt-6">
          <NuxtLink
            v-if="prevVideo"
            :to="`/cursos/${slug}/video/${prevVideo.id}`"
            class="btn bg-gray-500 hover:bg-gray-600 text-sm"
          >
            ← Vídeo anterior
          </NuxtLink>
          <NuxtLink
            v-if="nextVideo"
            :to="`/cursos/${slug}/video/${nextVideo.id}`"
            class="btn text-sm"
          >
            Próximo vídeo →
          </NuxtLink>
        </div>
      </div>

      <aside class="bg-white rounded-lg shadow p-4">
        <CourseVideoList
          :videos="allVideos"
          :course-slug="slug"
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

const course = ref<any>(null)
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
    const data = await useApi<any>(`/cursos/${slug}`)
    course.value = data.course
    allVideos.value = data.videos || []
    video.value = allVideos.value.find((v: any) => v.id === videoId)

    if (!data.user_enrollment) {
      await navigateTo(`/cursos/${slug}`)
      return
    }

    if (!video.value?.video_url) {
      const refreshed = await useApi<any>(`/cursos/${slug}`)
      course.value = refreshed.course
      allVideos.value = refreshed.videos || []
      video.value = allVideos.value.find((v: any) => v.id === videoId)
    }
  } finally {
    loading.value = false
  }
})
</script>
