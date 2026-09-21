const UNSAFE_PROTOCOL = /^(javascript|data|vbscript):/i

/** Completa http(s) se a pessoa informar só o domínio (empresa.com.br). */
export function normalizeWebsiteUrl(value?: string | null): string {
  const trimmed = (value || '').trim()
  if (!trimmed || UNSAFE_PROTOCOL.test(trimmed)) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, '')}`
}
