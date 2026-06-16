<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="group grid lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl card-modern"
  >
    <div
      class="aspect-[16/10] lg:aspect-auto lg:min-h-[280px] relative overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15"
      :class="reverse ? 'lg:order-2' : ''"
    >
      <img
        v-if="image"
        :src="image"
        :alt="post.titulo"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-6xl font-bold text-primary/20"
      >
        {{ post.titulo.charAt(0) }}
      </div>
    </div>

    <div class="p-6 lg:p-8 flex flex-col justify-center" :class="reverse ? 'lg:order-1' : ''">
      <div class="flex flex-wrap items-center gap-2 text-xs text-muted mb-3">
        <time v-if="post.published_at">{{ formatBlogDate(post.published_at) }}</time>
        <span v-if="post.reading_time_minutes">· {{ post.reading_time_minutes }} min</span>
      </div>
      <h3 class="text-xl lg:text-2xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
        {{ post.titulo }}
      </h3>
      <p v-if="post.excerpt" class="text-muted text-sm lg:text-base line-clamp-3 mb-4">{{ post.excerpt }}</p>
      <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Continuar lendo
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BlogPostListItem } from '~/types/blog'
import { blogPostImage, formatBlogDate } from '~/utils/blog'

const props = defineProps<{ post: BlogPostListItem; reverse?: boolean }>()
const image = computed(() => blogPostImage(props.post))
</script>
