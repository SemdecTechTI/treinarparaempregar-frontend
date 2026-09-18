/** Origem do Laravel no servidor (SSR, sitemap, robots). Mesma ordem do proxy Nitro. */
export function resolveServerApiOrigin(apiTarget?: string): string {
  const fromEnv = String(
    process.env.NUXT_PROXY_API_TARGET || process.env.NUXT_API_TARGET || '',
  ).replace(/\/$/, '')
  if (fromEnv) return fromEnv
  return String(apiTarget || '').replace(/\/$/, '')
}
