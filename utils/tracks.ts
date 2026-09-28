export type TrackOption = { name: string; slug: string }

export type TrackPresentation = {
  slug: string
  title: string
  description: string
  icon: string
  gradientClass: string
  to: string
}

const KNOWN_TRACKS: Record<string, { icon: string; description: string; gradient: string }> = {
  base: {
    icon: '📚',
    description: 'Base e preparação para o mercado',
    gradient: 'bg-gradient-to-br from-primary to-primary-light',
  },
  jovem: {
    icon: '🌟',
    description: 'Oportunidades para jovens',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-400',
  },
  saude: {
    icon: '🏥',
    description: 'Carreiras no setor de saúde',
    gradient: 'bg-gradient-to-br from-h3 to-accent',
  },
  servicos: {
    icon: '💼',
    description: 'Soft skills e atendimento',
    gradient: 'bg-gradient-to-br from-accent to-primary',
  },
  tecnicos: {
    icon: '🔧',
    description: 'Cursos técnicos especializados',
    gradient: 'bg-gradient-to-br from-h5 to-h6',
  },
  'treinar-para-empregar': {
    icon: '🎓',
    description: 'Cursos do programa Treinar para Empregar',
    gradient: 'bg-gradient-to-br from-primary-light to-accent',
  },
  'trilha-nautica': {
    icon: '⚓',
    description: 'Formação para o setor náutico',
    gradient: 'bg-gradient-to-br from-sky-600 to-primary',
  },
  'mulher-salvador': {
    icon: '💜',
    description: 'Cursos para mulheres em Salvador',
    gradient: 'bg-gradient-to-br from-pink-500 to-fuchsia-600',
  },
  'trilha-automotiva': {
    icon: '🚗',
    description: 'Formação para o setor automotivo',
    gradient: 'bg-gradient-to-br from-slate-600 to-primary',
  },
}

const FALLBACK_ICONS = ['📘', '🎯', '🛠️', '📌']
const FALLBACK_GRADIENTS = [
  'bg-gradient-to-br from-primary to-primary-light',
  'bg-gradient-to-br from-h3 to-accent',
  'bg-gradient-to-br from-accent to-primary',
  'bg-gradient-to-br from-h5 to-h6',
]

export function trackPresentation(track: TrackOption, index = 0): TrackPresentation {
  const known = KNOWN_TRACKS[track.slug]
  const title = track.name.replace(/\s*\(.*\)\s*$/, '').trim() || track.name

  return {
    slug: track.slug,
    title,
    description: known?.description || 'Cursos desta trilha de formação.',
    icon: known?.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length],
    gradientClass: known?.gradient || FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length],
    to: `/trilhas/${track.slug}`,
  }
}

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
