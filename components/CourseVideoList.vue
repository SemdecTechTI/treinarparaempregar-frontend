<template>
  <div>
    <h3 class="text-sm font-semibold text-primary mb-3">Vídeos</h3>
    <ul class="space-y-2">
      <li v-for="video in videos" :key="video.id">
        <NuxtLink
          :to="`/cursos/${courseSlug}/video/${video.id}`"
          class="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
          :class="currentVideoId === video.id ? 'bg-primary/5 ring-1 ring-primary/20' : ''"
        >
          <span class="text-xs w-5 text-center shrink-0">
            <span v-if="video.progress?.completed">✓</span>
            <span v-else-if="video.progress?.percent_watched > 0">◐</span>
            <span v-else>○</span>
          </span>
          <span class="flex-1 text-sm text-left">{{ video.title }}</span>
          <span class="text-xs text-muted shrink-0">{{ formatDuration(video.duration_seconds) }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  videos: any[]
  courseSlug: string
  currentVideoId?: number
}>()

function formatDuration(seconds: number) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
</script>
