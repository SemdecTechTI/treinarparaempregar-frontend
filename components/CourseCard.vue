<template>
  <article
    class="group card-modern overflow-hidden flex flex-col h-full"
    :class="{ 'ring-2 ring-accent/30': hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="aspect-[16/10] bg-gray-100 relative overflow-hidden">
      <img
        v-if="course.image"
        :src="resolveMediaUrl(course.image)"
        :alt="course.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center transition-all duration-500"
        :class="trilhaGradient"
      >
        <span class="text-5xl font-bold text-white/30 transition-transform duration-500 group-hover:scale-110">
          {{ course.title?.charAt(0) }}
        </span>
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        {{ trilhaLabel }}
      </span>

      <span
        v-if="course.modality"
        class="absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm"
        :class="course.modality === 'online' || course.modality === 'ead' ? 'bg-accent/90 text-white' : 'bg-white/90 text-primary'"
      >
        {{ modalidadeLabel }}
      </span>

      <span
        v-if="course.enrollment_status"
        class="absolute bottom-3 left-3"
      >
        <InscricaoStatusBadge :status="course.enrollment_status" />
      </span>

      <div class="absolute bottom-3 right-3 flex flex-col items-end gap-1">
        <span
          v-if="course.women_only"
          class="bg-pink-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
        >
          Só mulheres
        </span>
        <span
          v-if="course.adults_only"
          class="bg-amber-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
        >
          +18
        </span>
      </div>
    </div>

    <div class="p-5 flex flex-col flex-1">
      <h3 class="text-lg font-semibold text-primary mb-1 line-clamp-2 group-hover:text-primary-light transition-colors">
        {{ course.title }}
      </h3>
      <p v-if="course.partner" class="text-sm text-muted mb-3 flex items-center gap-1.5">
        <svg class="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        {{ course.partner.name }}
      </p>

      <div class="flex flex-wrap gap-2 text-xs mb-4">
        <span v-if="course.workload" class="bg-surface text-text px-2.5 py-1 rounded-lg">{{ course.workload }}</span>
      </div>

      <NuxtLink
        :to="`/cursos/${course.slug}`"
        class="btn text-sm py-2.5 px-4 w-full text-center mt-auto group/btn"
      >
        <span>Ver curso</span>
        <svg class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { resolveMediaUrl } from '~/utils/media'
import { trackLabel } from '~/utils/tracks'

interface CourseCardProps {
  course: {
    title: string
    slug: string
    track?: string
    workload?: string
    modality?: string
    available_vacancies?: number
    total_vacancies?: number
    enrollment_status?: 'disponivel' | 'reserva' | 'esgotado' | 'encerrada'
    image?: string | null
    women_only?: boolean
    adults_only?: boolean
    partner?: { name: string }
  }
}

const props = defineProps<CourseCardProps>()
const hovered = ref(false)

const trilhaGradients: Record<string, string> = {
  base: 'bg-gradient-to-br from-primary to-primary-light',
  saude: 'bg-gradient-to-br from-h3 to-accent',
  servicos: 'bg-gradient-to-br from-accent to-primary',
  tecnicos: 'bg-gradient-to-br from-h5 to-h6',
}

const trilhaLabel = computed(() => trackLabel(props.course.track))
const trilhaGradient = computed(() => trilhaGradients[props.course.track || ''] || 'bg-gradient-to-br from-primary/30 to-accent/30')
const modalidadeLabel = computed(() => {
  if (props.course.modality === 'online') return 'Online'
  if (props.course.modality === 'ead') return 'EAD'
  if (props.course.modality === 'presencial') return 'Presencial'
  return props.course.modality || ''
})
</script>
