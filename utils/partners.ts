export interface PublicPartner {
  id: number
  name: string
  logo?: string | null
  website_url?: string | null
  contact_email?: string | null
  contact_phone?: string | null
}

/** Quantos parceiros cabem no card da home (nomes + avatares). O restante vira +N. */
export const HERO_PARTNER_LIMIT = 3

export const partnerAvatarTones = [
  'bg-primary-light text-white',
  'bg-accent text-white',
  'bg-h4 text-primary',
  'bg-h5 text-white',
]

export function partnerAvatarTone(index: number) {
  return partnerAvatarTones[index % partnerAvatarTones.length]
}

export function partnerInitials(name?: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = copy[i]
    copy[i] = copy[j] as T
    copy[j] = current as T
  }
  return copy
}

export function pickHeroPartners(list: PublicPartner[]) {
  const shuffled = shuffleArray(list)
  const featured = shuffled.slice(0, HERO_PARTNER_LIMIT)
  return {
    featured,
    extraCount: Math.max(0, list.length - featured.length),
  }
}

export function partnerWebsiteHref(url?: string | null): string | null {
  const trimmed = (url || '').trim()
  if (!trimmed) return null
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, '')}`
}
