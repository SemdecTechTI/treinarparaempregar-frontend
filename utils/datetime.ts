/** Data de calendário sem deslocar o dia por fuso (ex.: 1983-01-21T00:00:00.000000Z). */
export function formatDate(value?: string | null): string {
  if (!value) return '—'
  const isoDate = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoDate) {
    return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
