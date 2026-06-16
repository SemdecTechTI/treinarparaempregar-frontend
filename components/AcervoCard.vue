<template>
  <article class="group card-modern overflow-hidden flex flex-col h-full">
    <NuxtLink :to="`/acervo/${acervo.slug}`" class="block">
      <div class="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        <img
          v-if="coverUrl"
          :src="coverUrl"
          :alt="acervo.titulo"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/30"
        >
          {{ acervo.titulo.charAt(0) }}
        </div>
        <div class="absolute top-3 left-3">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-primary">
            Acervo
          </span>
        </div>
      </div>
    </NuxtLink>

    <div class="p-5 flex flex-col flex-1">
      <h3 class="text-lg font-semibold text-primary mb-2 line-clamp-2">
        {{ acervo.titulo }}
      </h3>
      <p v-if="acervo.descricao" class="text-sm text-muted line-clamp-2 mb-3">{{ acervo.descricao }}</p>
      <p class="text-xs text-muted mb-3">{{ acervo.total_videos }} vídeo(s)</p>

      <ProgressBar v-if="acervo.enrolled" :percent="acervo.progress_percent || 0" class="mb-4" />

      <div class="mt-auto">
        <NuxtLink
          v-if="acervo.enrolled"
          :to="`/acervo/${acervo.slug}`"
          class="btn text-sm w-full justify-center"
        >
          {{ acervo.progress_percent > 0 ? 'Continuar' : 'Assistir' }}
        </NuxtLink>
        <NuxtLink
          v-else
          :to="`/acervo/${acervo.slug}`"
          class="btn btn-outline text-sm w-full justify-center"
        >
          Ver acervo
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { resolveMediaUrl } from '~/utils/media'

const props = defineProps<{ acervo: any }>()

const coverUrl = computed(() => {
  if (!props.acervo.capa) return null
  return resolveMediaUrl(props.acervo.capa)
})
</script>
