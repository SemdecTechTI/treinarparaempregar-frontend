export default defineNuxtPlugin(() => {
  const { capture } = useUtmAttribution()
  const router = useRouter()

  capture()
  router.afterEach(() => {
    capture()
  })
})
