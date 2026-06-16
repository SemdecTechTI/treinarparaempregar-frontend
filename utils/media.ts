/** Resolve URL de arquivo salvo no storage Laravel (/storage/...) */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
  if (url.startsWith('/')) return url
  return `/${url.replace(/^\//, '')}`
}
