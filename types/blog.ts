export interface BlogPostListItem {
  id: number
  titulo: string
  slug: string
  excerpt?: string | null
  cover_image?: string | null
  published_at?: string | null
  featured?: boolean
  reading_time_minutes?: number
  author?: { name: string } | null
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string
  meta_title?: string | null
  meta_description?: string | null
  og_image?: string | null
  canonical_url?: string | null
}
