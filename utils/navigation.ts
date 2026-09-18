/** Só paths internos (`/admin/cursos`). Bloqueia `//evil.com`. */
export function safeInternalPath(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null
  return path
}

export function homeForUser(isStaff: boolean) {
  return isStaff ? '/admin' : '/conta'
}
