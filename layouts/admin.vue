<template>
  <div v-if="showAdmin" class="min-h-screen flex flex-col bg-gray-100">
    <PrefeituraBarTop />
    <div class="flex flex-1 min-h-0">
      <AdminSidebar />
      <div class="flex-1 flex flex-col min-w-0">
        <main class="flex-1 p-6 overflow-auto">
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

/** Evita flash do painel antes do middleware/redirecionamento */
const showAdmin = computed(() => auth.initialized && auth.isStaff)

const vacancyNotifications = useVacancyNotifications()
watch(showAdmin, (visible) => {
  if (visible) vacancyNotifications.start()
  else vacancyNotifications.stop()
}, { immediate: true })
onUnmounted(() => vacancyNotifications.stop())
</script>
