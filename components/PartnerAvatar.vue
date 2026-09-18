<template>
  <div
    class="rounded-full overflow-hidden flex items-center justify-center font-bold shrink-0"
    :class="[sizeClass, logo ? 'bg-white' : tone]"
    :title="name"
    :aria-label="name"
  >
    <img
      v-if="logo"
      :src="resolveMediaUrl(logo)"
      :alt="name"
      :title="name"
      class="w-full h-full object-contain p-0.5 pointer-events-none"
    />
    <span v-else class="pointer-events-none">{{ partnerInitials(name) }}</span>
  </div>
</template>

<script setup lang="ts">
import { resolveMediaUrl } from '~/utils/media'
import { partnerInitials } from '~/utils/partners'

const props = withDefaults(
  defineProps<{
    name: string
    logo?: string | null
    tone?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    tone: 'bg-primary-light text-white',
    size: 'sm',
  },
)

const sizeClass = computed(() => {
  if (props.size === 'lg') return 'w-20 h-20 text-lg'
  if (props.size === 'md') return 'w-14 h-14 text-sm'
  return 'w-10 h-10 text-xs'
})
</script>
