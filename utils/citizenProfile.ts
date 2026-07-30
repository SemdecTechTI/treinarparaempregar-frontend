export const SEXOS = ['Masculino', 'Feminino'] as const

export const ORIENTACOES_SEXUAIS = [
  'Heterossexual',
  'Homossexual',
  'Bissexual',
  'Pansexual',
  'Assexual',
] as const

export const IDENTIDADES_GENERO = [
  'Mulher cisgênero',
  'Homem cisgênero',
  'Mulher trans',
  'Homem trans',
  'Travesti',
  'Pessoa não binária',
] as const

/** Identidades liberadas em cursos exclusivos para mulheres. */
export const WOMEN_GENDER_IDENTITIES = [
  'Mulher cisgênero',
  'Mulher trans',
] as const

export const RACAS = [
  'Branco',
  'Pardo',
  'Amarelo',
  'Indígena',
  'Preto',
] as const

export const ESCOLARIDADES = [
  'Fundamental Incompleto',
  'Fundamental Completo',
  'Médio Incompleto',
  'Médio Completo',
  'Superior Incompleto',
  'Superior Completo',
] as const

export const DEFICIENCIAS = [
  'Auditiva',
  'Mobilidade',
  'Visão',
  'Outro',
] as const

export function ageFromBirthDate(birthDate?: string | null): number | null {
  if (!birthDate) return null
  const birth = new Date(birthDate.includes('T') ? birthDate : `${birthDate}T12:00:00`)
  if (Number.isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1
  return age
}
