// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Poppins: [300, 400, 500, 600, 700],
    },
    display: 'swap',
  },
  runtimeConfig: {
    apiTarget: process.env.NUXT_PROXY_API_TARGET || 'http://localhost:8082',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3002',
    },
  },
  vite: {
    server: {
      // Dev: mesma origem (localhost:3002) → evita CORS/CSRF entre portas
      proxy: {
        '/api': {
          target: process.env.NUXT_PROXY_API_TARGET || 'http://localhost:8082',
          changeOrigin: true,
        },
        '/sanctum': {
          target: process.env.NUXT_PROXY_API_TARGET || 'http://localhost:8082',
          changeOrigin: true,
        },
        '/storage': {
          target: process.env.NUXT_PROXY_API_TARGET || 'http://localhost:8082',
          changeOrigin: true,
        },
      },
    },
  },
  css: ['~/assets/css/main.css', 'sweetalert2/dist/sweetalert2.min.css'],
  app: {
    head: {
      title: 'Treinar para Empregar',
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        {
          name: 'description',
          content: 'Plataforma municipal de qualificação profissional da Prefeitura de Salvador. Cursos presenciais e online gratuitos para cidadãos.',
        },
        { name: 'theme-color', content: '#284f94' },
        { name: 'application-name', content: 'Treinar para Empregar' },
        { name: 'apple-mobile-web-app-title', content: 'Treinar para Empregar' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'msapplication-TileColor', content: '#284f94' },
        { property: 'og:site_name', content: 'Treinar para Empregar' },
        { property: 'og:locale', content: 'pt_BR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
})
