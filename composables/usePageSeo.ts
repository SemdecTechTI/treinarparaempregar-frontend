import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_NAME } from '~/utils/site'
import { resolveMediaUrl } from '~/utils/media'

export interface PageSeoOptions {
  title?: string
  description?: string
  image?: string | null
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  noindex?: boolean
  canonical?: string
}

export function usePageSeo(options: PageSeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = (config.public.siteUrl as string) || 'http://localhost:3000'

  const pageTitle = options.title?.trim()
  const fullTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME
  const description = options.description?.trim() || DEFAULT_DESCRIPTION
  const path = options.path || route.path
  const canonical = options.canonical || absoluteUrl(path, siteUrl)

  const imagePath = options.image ? resolveMediaUrl(options.image) : '/icons/apple-touch-icon.png'
  const ogImage = absoluteUrl(imagePath, siteUrl)

  useSeoMeta({
    title: fullTitle,
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage,
    ogUrl: canonical,
    ogType: options.type || 'website',
    ogSiteName: SITE_NAME,
    ogLocale: 'pt_BR',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: ogImage,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow',
    articlePublishedTime: options.type === 'article' ? options.publishedTime : undefined,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}
