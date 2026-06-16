<template>
  <section v-if="posts.length" class="container mx-auto px-4 pb-20">
    <RevealOnScroll>
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Notícias</p>
          <h2 class="section-title">Últimas do blog</h2>
          <p class="text-muted mt-2 max-w-xl">Novidades, cursos e oportunidades do programa municipal.</p>
        </div>
        <NuxtLink to="/blog" class="btn btn-outline text-sm shrink-0">Ver todas as notícias</NuxtLink>
      </div>
    </RevealOnScroll>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <RevealOnScroll v-for="(post, i) in posts" :key="post.id" :delay="i * 80">
        <BlogCard :post="post" />
      </RevealOnScroll>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BlogPostListItem } from '~/types/blog'

const posts = ref<BlogPostListItem[]>([])

onMounted(async () => {
  try {
    posts.value = await useApiPublic<BlogPostListItem[]>('/blog?limit=3')
  } catch {
    posts.value = []
  }
})
</script>
