export function formPublicPath(slug: string) {
  return `/formulario/${slug}`
}

/** Base URL do site: no browser usa a origem atual (porta correta no dev). */
export function resolvePublicSiteUrl(siteUrl?: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return (siteUrl || 'http://localhost:3002').replace(/\/$/, '')
}

export function formPublicAbsoluteUrl(slug: string, siteUrl?: string) {
  return `${resolvePublicSiteUrl(siteUrl)}${formPublicPath(slug)}`
}
