<template>
  <div class="inline-flex justify-end" ref="rootRef">
    <button
      ref="triggerRef"
      type="button"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 transition-colors"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggle"
    >
      <span class="sr-only">Ações</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" aria-hidden="true">
        <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
      </svg>
    </button>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[60]" @click="close" />
      <div
        v-if="open"
        ref="menuRef"
        role="menu"
        class="fixed z-[70] min-w-[11rem] py-1 rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-black/5"
        :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      >
        <template v-for="(item, index) in visibleItems" :key="index">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            role="menuitem"
            class="block w-full text-left px-3 py-2 text-sm transition-colors"
            :class="itemClass(item)"
            @click="close"
          >
            {{ item.label }}
          </NuxtLink>
          <button
            v-else
            type="button"
            role="menuitem"
            class="block w-full text-left px-3 py-2 text-sm transition-colors disabled:opacity-50"
            :class="itemClass(item)"
            :disabled="item.disabled"
            @click="onItemClick(item)"
          >
            {{ item.label }}
          </button>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
export type RowActionItem = {
  label: string
  to?: string
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  hidden?: boolean
}

const props = defineProps<{
  items: RowActionItem[]
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const position = reactive({ top: 0, left: 0 })

const visibleItems = computed(() => props.items.filter(i => !i.hidden))

function itemClass(item: RowActionItem) {
  if (item.danger) {
    return 'text-red-600 hover:bg-red-50'
  }
  return 'text-slate-700 hover:bg-slate-100'
}

function updatePosition() {
  const el = triggerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const menuWidth = menuRef.value?.offsetWidth ?? 176
  const gap = 4
  position.top = rect.bottom + gap
  position.left = Math.max(8, rect.right - menuWidth)
}

function toggle() {
  if (open.value) {
    close()
    return
  }
  open.value = true
  nextTick(() => {
    updatePosition()
  })
}

function close() {
  open.value = false
}

function onItemClick(item: RowActionItem) {
  if (item.disabled) return
  close()
  item.onClick?.()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', close, true)
  window.addEventListener('resize', close)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', close, true)
  window.removeEventListener('resize', close)
})
</script>
