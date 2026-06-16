<template>
  <div>
  <!-- Hero -->
  <section class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent text-white">
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
    </div>
    <div class="container mx-auto px-4 py-16 lg:py-24 relative z-10">
      <p class="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Blog</p>
      <h1 class="text-3xl lg:text-5xl font-semibold text-white mb-4 max-w-3xl">Notícias e novidades</h1>
      <p class="text-white/80 text-lg max-w-2xl">
        Fique por dentro das oportunidades de qualificação profissional, parcerias e cursos do Treinar para Empregar.
      </p>
    </div>
  </section>

  <div class="container mx-auto px-4 py-12 lg:py-16">
    <div v-if="loading" class="space-y-8">
      <div class="skeleton h-96 rounded-3xl" />
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="skeleton h-72 rounded-2xl" />
      </div>
    </div>

    <p v-else-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <div v-else-if="!posts.length" class="text-center py-20 card-modern">
      <div class="text-5xl mb-4 opacity-30">📰</div>
      <p class="text-lg font-medium text-primary">Nenhuma publicação ainda</p>
      <p class="text-muted text-sm mt-2">Volte em breve para novidades do programa.</p>
    </div>

    <template v-else>
      <!-- Destaque -->
      <RevealOnScroll v-if="featuredPost">
        <BlogFeaturedHero :post="featuredPost" class="mb-12" />
      </RevealOnScroll>

      <!-- Split layouts -->
      <div v-if="splitPosts.length" class="space-y-8 mb-12">
        <RevealOnScroll v-for="(post, i) in splitPosts" :key="post.id" :delay="i * 100">
          <BlogSplitCard :post="post" :reverse="i % 2 === 1" />
        </RevealOnScroll>
      </div>

      <!-- Grid restante -->
      <RevealOnScroll v-if="gridPosts.length">
        <h2 class="text-xl font-semibold text-primary mb-6">Mais artigos</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard v-for="post in gridPosts" :key="post.id" :post="post" />
        </div>
      </RevealOnScroll>
    </template>
  </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPostListItem } from '~/types/blog'

usePageSeo({
  title: 'Blog',
  description: 'Notícias, novidades e oportunidades do programa Treinar para Empregar em Salvador.',
  path: '/blog',
})

const posts = ref<BlogPostListItem[]>([])
const loading = ref(true)
const error = ref('')

const featuredPost = computed(() => posts.value.find(p => p.featured) || posts.value[0])
const withoutFeatured = computed(() => {
  const featured = featuredPost.value
  if (!featured) return posts.value
  return posts.value.filter(p => p.id !== featured.id)
})
const splitPosts = computed(() => withoutFeatured.value.slice(0, 2))
const gridPosts = computed(() => withoutFeatured.value.slice(2))

onMounted(async () => {
  try {
    posts.value = await useApiPublic<BlogPostListItem[]>('/blog')
  } catch (e: any) {
    error.value = e?.data?.message || 'Erro ao carregar o blog.'
  } finally {
    loading.value = false
  }
})
</script>
