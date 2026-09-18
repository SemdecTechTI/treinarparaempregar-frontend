export function apiErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { data?: { message?: string; errors?: Record<string, unknown> } })?.data
  const errors = data?.errors
  if (errors && typeof errors === 'object') {
    const msgs = Object.values(errors).flat().filter(Boolean) as string[]
    if (msgs.length) return msgs.join('\n')
  }
  return data?.message || fallback
}
