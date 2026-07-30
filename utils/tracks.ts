export type TrackOption = { name: string; slug: string }

const FALLBACK_TRACKS: TrackOption[] = [
  { name: 'Base (SIMM Prepara)', slug: 'base' },
  { name: 'Saúde', slug: 'saude' },
  { name: 'Serviços', slug: 'servicos' },
  { name: 'Construção Civil', slug: 'tecnicos' },
  { name: 'Jovem', slug: 'jovem' },
]

let cachedTracks: TrackOption[] | null = null

export async function loadTracks(): Promise<TrackOption[]> {
  if (cachedTracks) return cachedTracks
  try {
    const data = await useApiPublic<TrackOption[]>('/tracks')
    cachedTracks = Array.isArray(data) && data.length ? data : FALLBACK_TRACKS
  } catch {
    cachedTracks = FALLBACK_TRACKS
  }
  return cachedTracks
}

export function trackLabel(slug?: string | null, tracks?: TrackOption[]): string {
  if (!slug) return '—'
  const list = tracks?.length ? tracks : (cachedTracks || FALLBACK_TRACKS)
  return list.find(t => t.slug === slug)?.name || slug
}

export function clearTracksCache() {
  cachedTracks = null
}
