export function readXsrfToken(): string | undefined {
  if (!import.meta.client) return undefined
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : undefined
}

function apiHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...extra,
  }
  const xsrf = readXsrfToken()
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf
  return headers
}

/** Base da API sem sufixo /api (para sanctum/csrf-cookie) */
export function apiOrigin(): string {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  if (apiBase.startsWith('/')) return ''
  return apiBase.replace(/\/api\/?$/, '')
}

function serverApiOrigin(): string {
  const config = useRuntimeConfig()
  return (config.apiTarget as string).replace(/\/$/, '')
}

function apiFetch() {
  return import.meta.server ? useRequestFetch() : $fetch
}

function apiBaseUrl(): string {
  const config = useRuntimeConfig()
  if (import.meta.server) {
    return `${serverApiOrigin()}/api`
  }
  return config.public.apiBase as string
}

export async function ensureSanctumCsrf() {
  const fetch = apiFetch()
  const baseURL = import.meta.server ? serverApiOrigin() : apiOrigin()

  await fetch('/sanctum/csrf-cookie', {
    baseURL,
    credentials: 'include',
  })
}

/** Rotas públicas — sem cookies (evita CORS estrito em leituras) */
export async function useApiPublic<T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
  return $fetch<T>(path, {
    baseURL: apiBaseUrl(),
    ...options,
    headers: apiHeaders(options.headers as Record<string, string> | undefined),
  })
}

/** Rotas autenticadas — envia cookies de sessão Sanctum */
export async function useApi<T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
  const fetch = apiFetch()

  return fetch<T>(path, {
    baseURL: apiBaseUrl(),
    credentials: 'include',
    ...options,
    headers: apiHeaders(options.headers as Record<string, string> | undefined),
  })
}

/** Download de arquivo binário (export CSV/XLSX) com sessão Sanctum */
export async function downloadApiBlob(
  path: string,
  downloadName: string,
  query?: Record<string, string | number | undefined>,
) {
  if (!import.meta.client) {
    throw new Error('Download disponível apenas no navegador.')
  }

  await ensureSanctumCsrf()

  const params = new URLSearchParams()
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') params.set(key, String(value))
    }
  }

  const qs = params.toString()
  const url = `${apiBaseUrl()}${path}${qs ? `?${qs}` : ''}`

  const headers: Record<string, string> = {
    Accept: 'application/octet-stream, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, */*',
    'X-Requested-With': 'XMLHttpRequest',
  }
  const xsrf = readXsrfToken()
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    let message = 'Não foi possível exportar.'
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // resposta não é JSON
    }
    throw new Error(message)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = downloadName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl)
}

/** Upload multipart (inscrições com documentos) */
export async function useApiForm<T>(path: string, formData: FormData, method = 'POST') {
  const fetch = apiFetch()

  return fetch<T>(path, {
    baseURL: apiBaseUrl(),
    method,
    body: formData,
    credentials: 'include',
    headers: apiHeaders(),
  })
}
