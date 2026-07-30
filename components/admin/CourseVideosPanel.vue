<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <h3 class="font-semibold text-primary">Vídeos</h3>
      <button type="button" class="btn text-sm py-2" @click="showForm = !showForm">
        {{ showForm ? 'Cancelar' : '+ Adicionar vídeo' }}
      </button>
    </div>

    <form v-if="showForm" @submit.prevent="addVideo" class="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
      <div>
        <label class="form-label">Título do vídeo</label>
        <input v-model="newVideo.title" type="text" required class="input-modern" />
      </div>
      <div>
        <label class="form-label">URL do vídeo</label>
        <input v-model="newVideo.video_url" type="url" required class="input-modern" placeholder="https://... (YouTube, Vimeo ou MP4)" />
      </div>
      <div>
        <label class="form-label">Descrição</label>
        <textarea v-model="newVideo.description" rows="2" class="input-modern" />
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="form-label">Duração (segundos)</label>
          <input v-model.number="newVideo.duration_seconds" type="number" min="0" class="input-modern" />
        </div>
        <div>
          <label class="form-label">Ordem</label>
          <input v-model.number="newVideo.sort_order" type="number" min="0" class="input-modern" />
        </div>
      </div>
      <p v-if="videoError" class="text-red-600 text-sm">{{ videoError }}</p>
      <button type="submit" class="btn text-sm py-2" :disabled="savingVideo">
        {{ savingVideo ? 'Salvando...' : 'Salvar vídeo' }}
      </button>
    </form>

    <div v-if="!videos.length" class="text-sm text-muted">Nenhum vídeo cadastrado.</div>

    <div v-else class="space-y-3">
      <div
        v-for="video in videos"
        :key="video.id"
        class="flex flex-wrap items-start justify-between gap-3 p-4 border border-gray-200 rounded-lg bg-white"
      >
        <div class="min-w-0 flex-1">
          <p class="font-medium text-primary">{{ video.title }}</p>
          <p class="text-xs text-muted truncate">{{ video.video_url }}</p>
          <p class="text-xs text-muted mt-1">Ordem {{ video.sort_order }} · {{ formatDuration(video.duration_seconds) }}</p>
        </div>
        <button type="button" class="text-xs text-red-600 hover:underline" @click="removeVideo(video)">
          Remover
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ courseId: number }>()
const emit = defineEmits<{ refreshed: [] }>()

const videos = ref<any[]>([])
const showForm = ref(false)
const savingVideo = ref(false)
const videoError = ref('')
const dialog = useDialog()

const newVideo = reactive({
  title: '',
  video_url: '',
  description: '',
  duration_seconds: 0,
  sort_order: 0,
})

function formatDuration(seconds: number) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

async function loadVideos() {
  const data = await useApi<any>(`/admin/courses/${props.courseId}`)
  videos.value = data.videos || []
}

async function addVideo() {
  savingVideo.value = true
  videoError.value = ''
  try {
    await useApi(`/admin/courses/${props.courseId}/videos`, {
      method: 'POST',
      body: { ...newVideo },
    })
    newVideo.title = ''
    newVideo.video_url = ''
    newVideo.description = ''
    newVideo.duration_seconds = 0
    newVideo.sort_order = 0
    showForm.value = false
    await loadVideos()
    emit('refreshed')
  } catch (e: any) {
    videoError.value = e?.data?.message || 'Erro ao adicionar vídeo.'
  } finally {
    savingVideo.value = false
  }
}

async function removeVideo(video: any) {
  if (!await dialog.confirm(`Remover o vídeo "${video.title}"?`, {
    title: 'Remover vídeo',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/courses/${props.courseId}/videos/${video.id}`, { method: 'DELETE' })
    await loadVideos()
    emit('refreshed')
  } catch (e: any) {
    videoError.value = e?.data?.message || 'Erro ao remover vídeo.'
  }
}

onMounted(loadVideos)
</script>
