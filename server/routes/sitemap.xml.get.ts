import { absoluteUrl } from '~/utils/site'
import { resolveServerApiOrigin } from '~/utils/serverApi'

const STATIC_PATHS = [
  '/',
  '/blog',
  '/quem-somos',
  '/cursos',
  '/parceiros',
  '/cadastrar',
  '/cadastre-sua-vaga',
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')
  const apiOrigin = resolveServerApiOrigin(config.apiTarget as string)

  let blogPaths: string[] = []
  let coursePaths: string[] = []
  let trackPaths: string[] = []

  try {
    const posts = await $fetch<Array<{ slug: string }>>(`${apiOrigin}/api/blog`, {
      headers: { Accept: 'application/json' },
    })
    blogPaths = (posts || []).map((p) => `/blog/${p.slug}`)
  } catch {
    // API indisponível — sitemap só com rotas estáticas
  }

  try {
    const courses = await $fetch<Array<{ slug: string }>>(`${apiOrigin}/api/cursos`, {
      headers: { Accept: 'application/json' },
    })
    coursePaths = (courses || []).map((c) => `/cursos/${c.slug}`)
  } catch {
    // idem
  }

  try {
    const tracks = await $fetch<Array<{ slug: string }>>(`${apiOrigin}/api/tracks`, {
      headers: { Accept: 'application/json' },
    })
    trackPaths = (tracks || []).map((track) => `/trilhas/${track.slug}`)
  } catch {
    trackPaths = ['/trilhas/base', '/trilhas/saude', '/trilhas/servicos', '/trilhas/tecnicos']
  }

  const paths = [...STATIC_PATHS, ...trackPaths, ...coursePaths, ...blogPaths]
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
