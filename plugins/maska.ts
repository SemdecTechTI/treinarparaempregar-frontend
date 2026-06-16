import { vMaska } from 'maska/vue'

/** No SSR, v-maska precisa de getSSRProps — o plugin .client não roda no servidor. */
const maskaSsrStub = {
  getSSRProps() {
    return {}
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive(
    'maska',
    import.meta.server ? maskaSsrStub : vMaska,
  )
})
