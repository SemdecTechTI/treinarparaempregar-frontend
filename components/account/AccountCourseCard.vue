<template>
  <article class="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden">
    <div class="flex flex-col sm:flex-row">
      <div class="sm:w-44 h-32 sm:h-auto bg-gray-100 shrink-0 relative overflow-hidden">
        <img
          v-if="enrollment.course?.image"
          :src="resolveMediaUrl(enrollment.course.image)"
          :alt="enrollment.course?.title"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full min-h-[8rem] flex items-center justify-center bg-gradient-to-br from-primary to-accent"
        >
          <span class="text-4xl font-bold text-white/30">{{ enrollment.course?.title?.charAt(0) || '?' }}</span>
        </div>
      </div>

      <div class="flex-1 p-4 sm:p-5 min-w-0">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-primary">{{ enrollment.course?.title || 'Curso indisponível' }}</p>
            <p class="text-xs text-muted mt-1">
              {{ trilhaLabel(enrollment.course?.track) }} · {{ modalidadeLabel(enrollment.course?.modality) }}
              <template v-if="enrollment.course?.partner"> · {{ enrollment.course.partner }}</template>
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <span
              v-if="enrollment.on_waiting_list"
              class="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800"
            >
              Lista de reserva
            </span>
            <EnrollmentStatusBadge :status="enrollment.status" />
          </div>
        </div>

        <p v-if="metaLine" class="text-xs text-muted mt-2">{{ metaLine }}</p>
        <p v-if="enrollment.created_at" class="text-xs text-muted mt-1">
          Inscrito em {{ formatDate(enrollment.created_at) }}
        </p>

        <ProgressBar
          v-if="enrollment.course?.modality === 'online'"
          :percent="enrollment.progress_percent || 0"
          class="mt-3"
        />

        <div class="mt-4">
          <NuxtLink
            v-if="enrollment.course?.slug"
            :to="`/cursos/${enrollment.course.slug}`"
            class="text-sm font-semibold text-accent"
          >
            {{ ctaLabel }} →
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { trackLabel } from '~/utils/tracks'
import { resolveMediaUrl } from '~/utils/media'
import type { CitizenEnrollment } from '~/composables/useCitizenDashboard'
import EnrollmentStatusBadge from '~/components/EnrollmentStatusBadge.vue'
import ProgressBar from '~/components/ProgressBar.vue'

const props = defineProps<{ enrollment: CitizenEnrollment }>()

function trilhaLabel(trilha?: string) {
  return trackLabel(trilha)
}

function modalidadeLabel(modalidade?: string) {
  if (modalidade === 'online') return 'Online'
  if (modalidade === 'ead') return 'EAD'
  if (modalidade === 'presencial') return 'Presencial'
  return modalidade || '—'
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const day = String(value).match(/^(\d{4}-\d{2}-\d{2})/)
  const date = day ? new Date(`${day[1]}T12:00:00`) : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('pt-BR')
}

const metaLine = computed(() => {
  const parts: string[] = []
  const course = props.enrollment.course
  if (course?.workload) parts.push(course.workload)
  if (course?.location) parts.push(course.location)
  const start = course?.course_start_date
  const end = course?.course_end_date
  if (start && end) parts.push(`${formatDate(start)} a ${formatDate(end)}`)
  else if (start) parts.push(`Início ${formatDate(start)}`)
  return parts.join(' · ')
})

const ctaLabel = computed(() => {
  const modality = props.enrollment.course?.modality
  if (modality === 'online') {
    return (props.enrollment.progress_percent || 0) > 0 ? 'Continuar assistindo' : 'Assistir aulas'
  }
  return 'Ver curso'
})
</script>
