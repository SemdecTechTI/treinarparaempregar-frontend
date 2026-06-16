<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="group relative block overflow-hidden rounded-3xl bg-primary shadow-xl min-h-[320px] lg:min-h-[420px]"
  >
    <img
      v-if="image"
      :src="image"
      :alt="post.titulo"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20 transition-all duration-500 group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary/50"
    />

    <div class="relative z-10 flex flex-col justify-end min-h-[320px] lg:min-h-[420px] p-8 lg:p-10">
      <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent mb-4">
        <span class="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Destaque
      </span>
      <h2 class="text-2xl lg:text-4xl font-semibold text-white mb-3 max-w-3xl">
        {{ post.titulo }}
      </h2>
      <p v-if="post.excerpt" class="text-white/80 text-sm lg:text-base max-w-2xl line-clamp-2 mb-4">
        {{ post.excerpt }}
      </p>
      <div class="flex flex-wrap items-center gap-4 text-sm text-white/70">
        <time v-if="post.published_at">{{ formatBlogDate(post.published_at) }}</time>
        <span v-if="post.reading_time_minutes">{{ post.reading_time_minutes }} min de leitura</span>
        <span v-if="post.author?.name">Por {{ post.author.name }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BlogPostListItem } from '~/types/blog'
import { blogPostImage, formatBlogDate } from '~/utils/blog'

const props = defineProps<{ post: BlogPostListItem }>()
const image = computed(() => blogPostImage(props.post))
</script>
