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

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
] as const

export function toDateInput(value?: string | null): string {
  if (!value) return ''
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/)
  return match?.[1] ?? ''
}

export function boolToSimNao(value: unknown): 'sim' | 'nao' {
  return value === true || value === 1 || value === '1' || value === 'sim' ? 'sim' : 'nao'
}

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
