export type UtmAttribution = {
  source: string | null
  medium: string | null
  campaign: string | null
  term: string | null
  content: string | null
}

const COOKIE_NAME = 'tpe_utm'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function firstQueryValue(value: unknown): string | null {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string' || !raw.trim()) return null
  return raw.trim()
}

function emptyUtm(): UtmAttribution {
  return { source: null, medium: null, campaign: null, term: null, content: null }
}

export function hasUtm(utm: UtmAttribution | null | undefined): boolean {
  return !!(utm?.source || utm?.medium || utm?.campaign || utm?.term || utm?.content)
}

export function useUtmAttribution() {
  const route = useRoute()
  const cookie = useCookie<UtmAttribution | null>(COOKIE_NAME, {
    default: () => null,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    watch: true,
  })

  const utm = computed<UtmAttribution>(() => cookie.value && hasUtm(cookie.value) ? cookie.value : emptyUtm())
  const campaign = computed(() => utm.value.campaign)

  function readFromQuery(): UtmAttribution {
    return {
      source: firstQueryValue(route.query.utm_source),
      medium: firstQueryValue(route.query.utm_medium),
      campaign: firstQueryValue(route.query.utm_campaign)
        || firstQueryValue(route.query.campanha)
        || firstQueryValue(route.query.campaign),
      term: firstQueryValue(route.query.utm_term),
      content: firstQueryValue(route.query.utm_content),
    }
  }

  function capture() {
    const fromQuery = readFromQuery()
    if (hasUtm(fromQuery)) {
      cookie.value = fromQuery
    }
  }

  function payload(): Record<string, string> {
    const current = utm.value
    const body: Record<string, string> = {}
    if (current.source) body.utm_source = current.source
    if (current.medium) body.utm_medium = current.medium
    if (current.campaign) body.utm_campaign = current.campaign
    if (current.term) body.utm_term = current.term
    if (current.content) body.utm_content = current.content
    return body
  }

  capture()

  return { utm, campaign, payload, capture }
}
