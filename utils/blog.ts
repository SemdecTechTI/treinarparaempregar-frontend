import type { BlogPostListItem } from '~/types/blog'
import { resolveMediaUrl } from '~/utils/media'

export function formatBlogDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function blogPostImage(post: BlogPostListItem): string | null {
  return post.cover_image ? resolveMediaUrl(post.cover_image) : null
}
