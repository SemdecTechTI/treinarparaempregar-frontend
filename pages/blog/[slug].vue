<template>
  <div v-if="loading" class="container mx-auto px-4 py-16 max-w-3xl">
    <div class="skeleton h-96 rounded-3xl mb-8" />
    <div class="skeleton h-64 rounded-2xl" />
  </div>

  <div v-else-if="error" class="container mx-auto px-4 py-16 text-center">
    <p class="text-red-600">{{ error }}</p>
    <NuxtLink to="/blog" class="btn btn-outline mt-4">Voltar ao blog</NuxtLink>
  </div>

  <article v-else-if="post" class="pb-20">
    <!-- Hero -->
    <div v-if="heroImage" class="relative z-0 h-[280px] sm:h-[360px] lg:h-[400px] overflow-hidden">
      <img :src="heroImage" :alt="post.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/10" />
    </div>
    <div
      v-else
      class="h-[200px] sm:h-[240px] bg-gradient-to-br from-primary via-primary-dark to-accent"
    />

  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto w-full">
      <!-- Título (fluxo normal — o conteúdo vem depois e não fica atrás) -->
      <div
        class="card-flat relative z-10 bg-white p-6 lg:p-8 w-full shadow-xl ring-1 ring-black/5"
        :class="heroImage ? '-mt-16 sm:-mt-20 lg:-mt-24 mb-8 lg:mb-10' : 'mt-8 sm:mt-10 mb-8 lg:mb-10'"
      >
        <nav class="mb-4">
          <NuxtLink
            to="/blog"
            class="text-sm text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao blog
          </NuxtLink>
        </nav>
        <div class="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
          <time v-if="post.published_at">{{ formatBlogDate(post.published_at) }}</time>
          <span v-if="post.reading_time_minutes">· {{ post.reading_time_minutes }} min de leitura</span>
          <span v-if="post.author?.name">· Por {{ post.author.name }}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary leading-tight text-left">
          {{ post.title }}
        </h1>
        <p v-if="post.excerpt" class="text-muted mt-4 text-base lg:text-lg text-left">{{ post.excerpt }}</p>
      </div>

      <!-- Conteúdo -->
      <div
        class="article-content w-full text-left"
        v-html="post.content"
      />

      <div class="mt-10 pt-8 border-t border-gray-100">
        <BlogShareBar :title="post.title" :url="shareUrl" />
      </div>

      <div class="mt-12 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/10 border border-primary/10">
        <h2 class="text-xl font-semibold text-primary mb-2">Quer se qualificar?</h2>
        <p class="text-muted text-sm mb-4">Explore os cursos disponíveis e inscreva-se gratuitamente na plataforma.</p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/cursos" class="btn text-sm">Ver cursos</NuxtLink>
          <NuxtLink to="/cadastrar" class="btn btn-outline text-sm">Criar conta</NuxtLink>
        </div>
      </div>
    </div>
  </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPostDetail } from '~/types/blog'
import { blogPostImage, formatBlogDate } from '~/utils/blog'
import { absoluteUrl } from '~/utils/site'
import { resolveMediaUrl } from '~/utils/media'

const route = useRoute()
const slug = route.params.slug as string

const post = ref<BlogPostDetail | null>(null)
const loading = ref(true)
const error = ref('')

const heroImage = computed(() => post.value ? blogPostImage(post.value) : null)

const shareUrl = computed(() => {
  if (!post.value) return ''
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  if (post.value.canonical_url) {
    return absoluteUrl(post.value.canonical_url, siteUrl)
  }
  return absoluteUrl(`/blog/${post.value.slug}`, siteUrl)
})

watch(post, (p) => {
  if (!p) return
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const seoTitle = p.meta_title?.replace(/\s*\|\s*Treinar para Empregar$/i, '') || p.title
  const canonical = p.canonical_url ? absoluteUrl(p.canonical_url, siteUrl) : absoluteUrl(`/blog/${p.slug}`, siteUrl)
  const imagePath = p.og_image || p.cover_image
  const ogImage = imagePath ? absoluteUrl(resolveMediaUrl(imagePath), siteUrl) : absoluteUrl('/icons/apple-touch-icon.png', siteUrl)

  usePageSeo({
    title: seoTitle,
    description: p.meta_description || p.excerpt || undefined,
    image: imagePath,
    path: `/blog/${p.slug}`,
    type: 'article',
    publishedTime: p.published_at,
    canonical,
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: p.title,
          description: p.meta_description || p.excerpt,
          image: ogImage,
          datePublished: p.published_at,
          author: p.author?.name ? { '@type': 'Person', name: p.author.name } : undefined,
          mainEntityOfPage: canonical,
        }),
      },
    ],
  })
}, { immediate: true })

onMounted(async () => {
  try {
    const data = await useApiPublic<{ post: BlogPostDetail }>(`/blog/${slug}`)
    post.value = data.post
  } catch (e: any) {
    error.value = e?.data?.message || 'Artigo não encontrado.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.article-content {
  @apply w-full text-left;
}

.article-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.8;
  color: var(--color-text);
  text-align: left;
}

.article-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  color: var(--color-primary);
  text-align: left;
}

.article-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
  text-align: left;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(a) {
  color: var(--color-accent);
  font-weight: 600;
}

.article-content :deep(img) {
  display: block;
  border-radius: 1rem;
  margin: 1.5rem auto;
  max-width: 100%;
  width: 100%;
  height: auto;
}

.article-content :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--color-muted);
  font-style: italic;
  text-align: left;
}

.article-content :deep(div) {
  max-width: 100%;
}
</style>
