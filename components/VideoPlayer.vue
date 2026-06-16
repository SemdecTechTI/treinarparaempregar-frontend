<template>
  <div class="aspect-video bg-black rounded-lg overflow-hidden">
    <video
      ref="videoRef"
      class="w-full h-full"
      :src="isDirectVideo ? videoUrl : undefined"
      controls
      @timeupdate="onTimeUpdate"
      @pause="onPause"
      @ended="onEnded"
    />
    <iframe
      v-if="!isDirectVideo && embedUrl"
      :src="embedUrl"
      class="w-full h-full"
      allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    videoUrl: string
    duration: number
    lessonId?: number
    acervoVideoId?: number
    progressType?: 'lesson' | 'acervo_video'
  }>(),
  { progressType: 'lesson' },
)

const videoRef = ref<HTMLVideoElement | null>(null)
const { saveProgress, getProgress } = useProgress()

const resourceId = computed(() => props.acervoVideoId ?? props.lessonId ?? 0)
const progressKind = computed(() =>
  props.acervoVideoId ? 'acervo_video' : props.progressType,
)

const isDirectVideo = computed(() =>
  /\.(mp4|webm|ogg)(\?|$)/i.test(props.videoUrl) || props.videoUrl.includes('commondatastorage'),
)

const embedUrl = computed(() => {
  const url = props.videoUrl
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.match(/(?:youtu\.be\/|v=)([^&]+)/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}` : null
  }
  if (url.includes('vimeo.com')) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  return null
})

onMounted(async () => {
  if (!isDirectVideo.value || !videoRef.value || !resourceId.value) return
  const saved = await getProgress(resourceId.value, progressKind.value)
  if (saved > 0) {
    videoRef.value.currentTime = saved
  }
})

function onTimeUpdate() {
  if (!videoRef.value || !resourceId.value) return
  saveProgress(resourceId.value, videoRef.value.currentTime, props.duration, false, progressKind.value)
}

function onPause() {
  if (!videoRef.value || !resourceId.value) return
  saveProgress(resourceId.value, videoRef.value.currentTime, props.duration, true, progressKind.value)
}

function onEnded() {
  if (!videoRef.value || !resourceId.value) return
  saveProgress(resourceId.value, props.duration, props.duration, true, progressKind.value)
}
</script>
