export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')
  const sitemap = siteUrl ? `${siteUrl}/sitemap.xml` : '/sitemap.xml'

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /

Disallow: /admin
Disallow: /conta
Disallow: /entrar
Disallow: /recuperar-senha
Disallow: /api

Sitemap: ${sitemap}
`
})
