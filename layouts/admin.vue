<template>
  <div v-if="showAdmin" class="min-h-screen flex flex-col bg-gray-100">
    <PrefeituraBarTop />
    <ClientOnly>
      <header
        v-if="isMobile"
        class="bg-[#1a2d4a] text-white flex items-center gap-3 px-4 h-14 shrink-0"
      >
        <button
          type="button"
          class="-ml-2 p-2 rounded hover:bg-white/10"
          aria-label="Abrir menu"
          @click="sidebarOpen = true"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <span class="font-semibold text-sm">Painel Administrativo</span>
      </header>
    </ClientOnly>
    <div class="flex flex-1 min-h-0">
      <AdminSidebar />
      <div class="flex-1 flex flex-col min-w-0">
        <main class="admin-content flex-1 p-4 sm:p-6 overflow-auto">
          <div class="max-w-6xl mx-auto w-full">
            <slot />
          </div>
        </main>
      </div>
    </div>
    <PrefeituraBarFooter />
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const sidebarOpen = useAdminSidebar()
const isMobile = ref(false)

/** Evita flash do painel antes do middleware/redirecionamento */
const showAdmin = computed(() => auth.initialized && auth.isStaff)

const vacancyNotifications = useVacancyNotifications()
watch(showAdmin, (visible) => {
  if (visible) vacancyNotifications.start()
  else vacancyNotifications.stop()
}, { immediate: true })

let stopMobileMq: (() => void) | undefined
onMounted(() => {
  const mq = window.matchMedia('(max-width: 1023px)')
  const sync = () => { isMobile.value = mq.matches }
  sync()
  mq.addEventListener('change', sync)
  stopMobileMq = () => mq.removeEventListener('change', sync)
})
onUnmounted(() => {
  stopMobileMq?.()
  vacancyNotifications.stop()
})
</script>
