export const SITE_NAME = 'Treinar para Empregar'
export const DEFAULT_DESCRIPTION =
  'Plataforma municipal de qualificação profissional da Prefeitura de Salvador. Cursos presenciais e online gratuitos para cidadãos.'

export function absoluteUrl(path: string, siteUrl: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = siteUrl.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
