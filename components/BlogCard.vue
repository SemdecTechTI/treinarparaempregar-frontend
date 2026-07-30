<template>
  <article class="group card-modern overflow-hidden flex flex-col h-full">
    <NuxtLink :to="`/blog/${post.slug}`" class="block">
      <div class="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        <img
          v-if="image"
          :src="image"
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/30"
        >
          {{ post.title.charAt(0) }}
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </NuxtLink>

    <div class="p-5 flex flex-col flex-1">
      <div class="flex flex-wrap items-center gap-2 text-xs text-muted mb-3">
        <time v-if="post.published_at">{{ formatBlogDate(post.published_at) }}</time>
        <span v-if="post.reading_time_minutes">· {{ post.reading_time_minutes }} min de leitura</span>
      </div>

      <NuxtLink :to="`/blog/${post.slug}`" class="block flex-1">
        <h3 class="text-lg font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {{ post.title }}
        </h3>
        <p v-if="post.excerpt" class="text-sm text-muted line-clamp-3">{{ post.excerpt }}</p>
      </NuxtLink>

      <NuxtLink
        :to="`/blog/${post.slug}`"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-accent mt-4 group/link"
      >
        Ler artigo
        <svg class="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPostListItem } from '~/types/blog'
import { blogPostImage, formatBlogDate } from '~/utils/blog'

const props = defineProps<{ post: BlogPostListItem }>()
const image = computed(() => blogPostImage(props.post))
</script>
