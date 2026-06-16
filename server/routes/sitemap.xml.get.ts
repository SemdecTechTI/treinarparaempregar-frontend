import { absoluteUrl } from '~/utils/site'

const STATIC_PATHS = [
  '/',
  '/blog',
  '/quem-somos',
  '/cursos',
  '/cadastrar',
  '/entrar',
  '/seja-parceiro',
  '/trilhas/base',
  '/trilhas/saude',
  '/trilhas/servicos',
  '/trilhas/tecnicos',
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')
  const apiOrigin = (process.env.NUXT_PROXY_API_TARGET || 'http://localhost:8082').replace(/\/$/, '')

  let blogPaths: string[] = []
  try {
    const posts = await $fetch<Array<{ slug: string }>>(`${apiOrigin}/api/blog`, {
      headers: { Accept: 'application/json' },
    })
    blogPaths = posts.map((p) => `/blog/${p.slug}`)
  } catch {
    // API indisponível — sitemap só com rotas estáticas
  }

  const paths = [...STATIC_PATHS, ...blogPaths]
  const urls = paths.map((path) => {
    const loc = absoluteUrl(path, siteUrl)
    return `<url><loc>${loc}</loc><changefreq>weekly</changefreq></url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
