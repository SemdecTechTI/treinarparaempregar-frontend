export function useReveal() {
  const observer = ref<IntersectionObserver | null>(null)

  function observe(el: HTMLElement | null, delay = 0) {
    if (!el || typeof IntersectionObserver === 'undefined') {
      if (el) el.classList.add('visible')
      return
    }

    el.style.transitionDelay = `${delay}ms`

    if (!observer.value) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.value?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )
    }

    observer.value.observe(el)
  }

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  return { observe }
}
