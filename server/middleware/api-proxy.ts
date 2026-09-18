const PREFIXES = ['/api', '/sanctum', '/storage'] as const

function shouldProxy(pathname: string): boolean {
  return PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function proxyTarget(): string {
  const config = useRuntimeConfig()
  return String(
    process.env.NUXT_PROXY_API_TARGET
    || process.env.NUXT_API_TARGET
    || config.apiTarget
    || '',
  ).replace(/\/$/, '')
}

export default defineEventHandler((event) => {
  // Dev: o Vite já faz esse proxy. Produção (`npm start`) usa este middleware.
  if (import.meta.dev) {
    return
  }

  const url = getRequestURL(event)
  if (!shouldProxy(url.pathname)) {
    return
  }

  const target = proxyTarget()
  if (!target) {
    throw createError({
      statusCode: 502,
      message: 'NUXT_PROXY_API_TARGET não configurado',
    })
  }

  const host = getRequestHeader(event, 'host') || url.host
  const destination = `${target}${url.pathname}${url.search}`

  return proxyRequest(event, destination, {
    headers: {
      host,
      'x-forwarded-host': host,
      'x-forwarded-proto': url.protocol.replace(':', ''),
    },
  })
})
