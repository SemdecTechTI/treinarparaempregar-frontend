/** Resolve URL de upload: path `uploads/...` vira o proxy `/api/media/...`. */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url

  const path = url.replace(/^\//, '')
  if (path.startsWith('api/media/')) return `/${path}`
  if (path.startsWith('uploads/')) return `/api/media/${path}`
  if (url.startsWith('/')) return url
  return `/${path}`
}
