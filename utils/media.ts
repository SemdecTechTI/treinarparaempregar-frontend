/** Sempre `/api/media/uploads/...`. Não deixar URL assinada do bucket. */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('data:')) return url

  const withoutQuery = url.split('?')[0]
  const uploads = withoutQuery.match(/(uploads\/.+)$/)
  if (uploads) return `/api/media/${uploads[1]}`

  const path = withoutQuery.replace(/^\//, '')
  if (path.startsWith('api/media/')) return `/${path}`
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return url
  return `/${path}`
}
